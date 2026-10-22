const fs = require('fs');

module.exports = function renderCertificates() {
  const { certificates, featuredCertificates } = JSON.parse(fs.readFileSync('certificates.json', 'utf8'));
  const byId = new Map(certificates.map(c => [c.id, c]));
  if (byId.size !== certificates.length) throw Error('Certificate IDs must be unique.');
  if (!Array.isArray(featuredCertificates) || featuredCertificates.length !== 3 ||
      new Set(featuredCertificates).size !== 3 || featuredCertificates.some(id => !byId.has(id))) {
    throw Error('featuredCertificates must contain exactly three distinct existing certificate IDs, in display order.');
  }
  const featured = featuredCertificates.map(id => byId.get(id));
  const remaining = certificates.filter(c => !featuredCertificates.includes(c.id));
  const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  const thumbnail = c => `<button class="certificate-trigger" type="button" data-certificate="${escape(c.title)}" data-image="${escape(c.publicImage)}" data-description="${escape(c.displayLabel + ' · ' + c.issuer + ' · ' + c.date + ' · ' + c.cpdHours + ' CPD hours')}" aria-label="View ${escape(c.title)}, ${escape(c.type)}, ${c.year}"><img src="${escape(c.thumbnail)}" width="226" height="320" loading="lazy" alt="${escape(c.title)} certificate thumbnail"><span>${c.year}</span></button>`;
  const thumbnails = `<div class="certificate-thumbnails">${featured.map(thumbnail).join('')}</div><div class="certificate-thumbnails certificate-extra" id="certificate-extra" hidden>${remaining.map(thumbnail).join('')}</div>`;
  return fs.readFileSync('templates/certificates.html', 'utf8')
    .replace('<!-- certificate-thumbnails -->', thumbnails)
    .replaceAll('{{certificate-count}}', String(certificates.length));
};
