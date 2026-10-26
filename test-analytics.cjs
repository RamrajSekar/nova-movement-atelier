const fs = require('fs'), vm = require('vm'), assert = require('node:assert/strict');
const code = fs.readFileSync('src/assets/analytics.js', 'utf8');
function browser(host = 'novamovementatelier.com.au', path = '/', privacy = {}) {
  const scripts = [], listeners = {};
  class Element {
    constructor(href, area) { this.href = href; this.area = area; }
    getAttribute() { return this.href; }
    closest(selector) { return selector === 'a[href]' || selector === this.area ? this : null; }
  }
  const window = {};
  const context = vm.createContext({ window, Element, URL, Date,
    location: { hostname: host, protocol: host === 'localhost' ? 'http:' : 'https:', pathname: path,
      href: 'https://' + host + path + '?email=private@example.com#symptoms' },
    navigator: privacy,
    document: {
      createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
      addEventListener: (name, callback) => { assert(!listeners[name], 'duplicate listener'); listeners[name] = callback; }
    }
  });
  vm.runInContext(code, context);
  return { context, window, scripts, listeners, Element };
}
const b = browser();
const events = () => b.window.dataLayer.filter(x => x[0] === 'event');
assert.equal(events().length, 1);
assert.equal(events()[0][1], 'page_view');
assert.equal(b.scripts.length, 1);
assert(b.scripts[0].src.endsWith('G-FE01RRDFWW'));
vm.runInContext(code, b.context);
assert.equal(events().length, 1);
assert.equal(b.scripts.length, 1);
for (const [href, area, eventName, location] of [
  ['https://nova-movement-atelier.au5.cliniko.com/bookings?patient=secret', '#booking', 'booking_click', 'booking_section'],
  ['tel:0482044525', '.hero', 'phone_click', 'hero']
]) {
  const before = events().length;
  const anchor = new b.Element(href, area);
  const child = new b.Element();
  child.closest = () => anchor;
  b.listeners.click({ target: child });
  assert.equal(events().length, before + 1);
  const event = events().at(-1);
  assert.equal(event[1], eventName);
  assert.equal(event[2].button_location, location);
  assert.equal(event[2].page_location, 'https://novamovementatelier.com.au/');
}
const count = events().length;
for (const href of ['#booking', 'mailto:private@example.com', 'https://example.com/bookings', 'https://nova-movement-atelier.au5.cliniko.com/other']) {
  b.listeners.click({ target: new b.Element(href) });
}
assert.equal(events().length, count);
assert(!JSON.stringify(b.window.dataLayer).match(/private@example|patient=|secret|symptoms|0482044525|#/));
for (const host of ['localhost', '127.0.0.1', 'nova-movement-atelier.netlify.app', 'deploy-preview-1--nova.netlify.app', 'staging.novamovementatelier.com.au', 'novamovementatelier.com.au.example.com']) {
  const blocked = browser(host);
  assert.equal(blocked.scripts.length, 0, host);
  assert.equal(blocked.window.dataLayer, undefined, host);
}
for (const privacy of [{ globalPrivacyControl: true }, { doNotTrack: '1' }]) assert.equal(browser(undefined, '/', privacy).scripts.length, 0);
assert.equal(browser(undefined, '/private/').scripts.length, 0);
assert.equal(browser('www.novamovementatelier.com.au').scripts.length, 1);
const sitemap = fs.readFileSync('dist/sitemap.xml', 'utf8');
for (const match of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
  const url = new URL(match[1]);
  const html = fs.readFileSync('dist' + url.pathname + 'index.html', 'utf8');
  assert.equal((html.match(/src="\/assets\/analytics.js"/g) || []).length, 1);
  const page = browser(url.hostname, url.pathname);
  assert.equal(page.window.dataLayer.filter(x => x[0] === 'event' && x[1] === 'page_view').length, 1);
}
console.log('PASS: single tag/view per public document; single nested-link click events; no sensitive URL/link values; private/preview/local hosts blocked; privacy preferences respected.');
