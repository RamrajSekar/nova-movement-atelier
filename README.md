# Nova Movement Atelier

Responsive static website for Nova Movement Atelier, Port Augusta.

## Build

Requires Node.js 22 or later. No external packages are required.

```sh
npm run build
```

Edit the homepage in `src/index.html`, images in `src/assets`, and service content in `build-seo.cjs`. Generated output is in `dist/` and is not committed.

## Netlify

Import this GitHub repository in Netlify. The included `netlify.toml` sets the build command to `npm run build` and the publish directory to `dist`. No custom domain or DNS changes are needed for the initial deployment.

Build settings:

- `certificatesEnabled` in `site-settings.json` controls the certificate strip and viewer; currently `true`. `CERTIFICATES_ENABLED=true|false` overrides it at build time. Ten actual certificates use optimised WebP images in `src/assets/certificates`; original documents are stored outside this repository. Thumbnails show years; the viewer retains attendance/completion details.

- `appointmentsFeesEnabled` in `site-settings.json` controls the Appointments & fees section; currently `false`. Set to `true` and rebuild/redeploy to restore the section and fees navigation label. An optional `APPOINTMENTS_FEES_ENABLED=true|false` environment variable overrides this setting. Hidden fees are excluded from published HTML; source content is preserved in `templates/appointments-fees.html`.

- `SERVICE_PAGES_ENABLED=true` enables the five service pages, card links and sitemap entries. Set to `false` and redeploy to disable them.
- Production indexing is enabled only for the production context on the exact clinic hostname (or www). Preview/branch contexts remain noindex even if INDEXING_ENABLED=true is inherited. INDEXING_ENABLED=false remains an emergency kill switch. Nonpublic HTML retains noindex; this is not access control.
- Canonicals, clinic schema URLs and sitemap entries always use https://novamovementatelier.com.au, defined in seo-config.cjs. Deployment URLs never replace the canonical origin. SITE_URL/URL identify the build host for indexing eligibility.

The flags are defined in `netlify.toml`. Change them there and push a commit to trigger a deployment.

Before public launch: complete mobile/browser QA, have the clinic approve copy and image usage, and review redirects. The booking buttons currently open the clinic's existing Cliniko service.

## Source notes

The repository contains the current approved design and only the image assets it references. The practitioner portrait was enhanced with AI and should be approved by Suren before public release. Hosting credentials and Sites-specific metadata are excluded.

## Featured certificates

Edit `featuredCertificates` at the top of `certificates.json` to choose the three initially visible certificates. List exactly three certificate IDs in the desired order, then run `npm run build`. The remaining certificates keep their order from the `certificates` array. The enlarged viewer follows the featured three, then the remaining certificates. Unknown or duplicate IDs fail the build with a clear error.

Current featured certificates: Vestibular competency (2025), TMD (2025), and Sports Physiotherapy Level 2 (2024).

## Indexing verification and deployment

Run `node test-indexing.cjs` and `npm run build`. The default build targets production. To generate a local noindex build, set INDEXING_ENABLED=false. Tests build in a temporary directory and check all six sitemap pages, conflicting robots/googlebot tags, private-page fixtures, production/www host detection, preview and branch contexts, staging, the kill switch, canonical URLs and request-host headers.

Commit these changes and push to the Netlify production branch (main), then wait for a successful production deployment. In Netlify, check for old UI environment values or custom header rules that may still impose noindex; production needs INDEXING_ENABLED=true and SITE_URL=https://novamovementatelier.com.au. Do not change DNS or email records. The netlify/edge-functions/indexing-host-guard.js function must be included in the deployment so Netlify aliases remain restricted.

After deployment, inspect the live homepage and each sitemap service URL: HTTP success, no restrictive robots/googlebot tags or X-Robots-Tag header, production canonical, robots.txt allowing public crawling, and production URLs in sitemap.xml. Preview deployments must still return noindex. This repository build cannot verify extra restrictions added outside the repository.

Submit https://novamovementatelier.com.au/sitemap.xml in Google Search Console. In URL Inspection, inspect https://novamovementatelier.com.au/, choose Test live URL, confirm crawl allowed, successful fetch and indexing allowed, then choose Request indexing. Repeat for important service pages. Requesting indexing does not guarantee inclusion or immediate processing.
