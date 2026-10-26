const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync } = require('child_process');
const assert = require('node:assert/strict');
const { indexingPolicy, isProductionHost } = require('./seo-config.cjs');

async function main() {
  assert(isProductionHost('novamovementatelier.com.au'));
  assert(isProductionHost('www.novamovementatelier.com.au'));
  assert(!isProductionHost('novamovementatelier.com.au.example.com'));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nova-indexing-'));
  // Work only in a fresh temporary directory; never mutate the checkout/build under review.
  for (const name of ['src', 'templates', 'build.cjs', 'build-seo.cjs', 'seo-config.cjs', 'render-certificates.cjs', 'certificates.json', 'service-content.json', 'vestibular-page.json', 'site-settings.json']) {
    fs.cpSync(path.join(__dirname, name), path.join(root, name), { recursive: true });
  }
  const home = path.join(root, 'src/index.html');
  fs.writeFileSync(home, fs.readFileSync(home, 'utf8').replace('</head>', '<META content="noindex" NAME="Googlebot"><meta name=\'robots\' content=\'noindex\'></head>'));
  fs.mkdirSync(path.join(root, 'src/private'), { recursive: true });
  fs.writeFileSync(path.join(root, 'src/private/index.html'), '<html><head><meta name="robots" content="noindex"></head><body>Private fixture</body></html>');
  const cases = [
    ['production', { CONTEXT: 'production', SITE_URL: 'https://novamovementatelier.com.au', INDEXING_ENABLED: 'true' }, true],
    ['www production', { CONTEXT: 'production', URL: 'https://www.novamovementatelier.com.au' }, true],
    ['deploy preview', { CONTEXT: 'deploy-preview', SITE_URL: 'https://novamovementatelier.com.au', INDEXING_ENABLED: 'true' }, false],
    ['branch deploy', { CONTEXT: 'branch-deploy', URL: 'https://novamovementatelier.com.au' }, false],
    ['staging host', { SITE_URL: 'https://staging.example.com', INDEXING_ENABLED: 'true' }, false],
    ['explicit kill switch', { CONTEXT: 'production', INDEXING_ENABLED: 'false' }, false],
    ['default build', {}, true]
  ];
  for (const [label, vars, expected] of cases) {
    const env = { ...process.env };
    for (const key of ['CONTEXT', 'SITE_URL', 'URL', 'DEPLOY_PRIME_URL', 'INDEXING_ENABLED']) delete env[key];
    Object.assign(env, vars);
    assert.equal(indexingPolicy(env).indexing, expected);
    execFileSync(process.execPath, ['build.cjs'], { cwd: root, env, stdio: 'pipe' });
    const read = file => fs.readFileSync(path.join(root, 'dist', file), 'utf8');
    const sitemap = read('sitemap.xml');
    const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]));
    assert.equal(urls.length, 6);
    for (const url of urls) {
      assert.equal(url.origin, 'https://novamovementatelier.com.au');
      const html = read(url.pathname.slice(1) + 'index.html');
      assert.equal(/noindex/i.test(html), !expected, label + ' ' + url.pathname);
      assert(!/name=["']googlebot/i.test(html));
      assert(html.includes(`rel="canonical" href="${url.href}"`));
      assert.equal((html.match(/<h1>/g) || []).length, 1);
      assert.equal(html.includes('src="/assets/analytics.js"'), indexingPolicy(env).production);
    }
    assert(read('robots.txt').includes('Allow: /'));
    assert(!/Disallow:\s*\//i.test(read('robots.txt')));
    assert(read('robots.txt').includes('https://novamovementatelier.com.au/sitemap.xml'));
    assert(read('private/index.html').includes('noindex'));
    assert(!read('private/index.html').includes('src="/assets/analytics.js"'));
    const globalHeaders = read('_headers').split('\n/private/')[0];
    assert.equal(globalHeaders.includes('X-Robots-Tag'), !expected);
    assert(read('_headers').includes('/private/\n  X-Robots-Tag: noindex'));
    console.log('PASS: ' + label);
  }
  const source = fs.readFileSync(path.join(__dirname, 'netlify/edge-functions/indexing-host-guard.js'), 'utf8');
  const { default: handler } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  for (const host of ['novamovementatelier.com.au', 'www.novamovementatelier.com.au', 'nova-movement-atelier.netlify.app', 'deploy-preview-1--nova.netlify.app', 'staging.novamovementatelier.com.au']) {
    const response = await handler(new Request('https://' + host), { next: async () => new Response('page') });
    assert.equal(response.headers.has('X-Robots-Tag'), !isProductionHost(host));
  }
  const restricted = await handler(new Request('https://novamovementatelier.com.au/private/'), { next: async () => new Response('private', { headers: { 'X-Robots-Tag': 'noindex' } }) });
  assert.equal(restricted.headers.get('X-Robots-Tag'), 'noindex');
  console.log('PASS: request-host restrictions and private headers preserved');
  console.log('Temporary test builds: ' + root);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
