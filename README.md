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

## Google Analytics 4

Measurement ID: `G-FE01RRDFWW`. `build.cjs` inserts `/assets/analytics.js` once on public production pages only. The browser also requires HTTPS and the exact production apex or www hostname, and refuses unknown/private paths, localhost, Netlify aliases and preview hosts. Global Privacy Control and Do Not Track opt-outs prevent loading. There were no existing consent controls when this integration was added; it adds no banner and does not override analytics consent set by another integration. If consent controls are introduced, integrate them before changing collection behaviour.

This is a static multi-page site: each navigation loads a new document and sends one manual page_view. Section/hash navigation is not a route change and sends no additional view. There is no SPA router or History API routing to instrument. Do not add a second tag through Netlify snippets, Google Tag Manager or another integration.

`booking_click` counts only HTTPS links to Nova's Cliniko `/bookings` path; `phone_click` counts tel links. Neither indicates a completed booking or connected call. Internal links to the homepage booking section do not count as booking-service clicks. The only custom parameter is `button_location`, with a fixed label such as `hero`, `booking_section`, `mobile_bar` or `service_content`. Native navigation is untouched. URLs sent to GA are fixed public page URLs on the canonical production host, without queries or fragments. Titles use the fixed clinic name; referrers are suppressed. No link text/destination, phone/email, form fields, patient data or appointment details are sent by this code. Advertising consent is denied, Google Signals and advertising personalisation are disabled. Nothing is installed in Cliniko.

Before deploying, in GA Admin > Data streams > this Web stream, turn Enhanced Measurement OFF (including automatic page views/history changes, outbound clicks, site search and form interactions). Otherwise Google-managed automatic collection can duplicate manual events or collect raw URLs independently of this code. Do not enable user-provided data collection, Google Signals, advertising personalisation or cross-domain tracking into Cliniko. Check that no connected Google tag/GTM destination adds these features. In Custom definitions, create an event-scoped dimension for `button_location` if location reporting is needed. Events may optionally be marked as key events, but label/report them as click intent, not completed bookings/calls.

Run `npm run build`, `node test-analytics.cjs` and `node test-indexing.cjs`. Tests do not transmit real analytics hits. After the Netlify deployment, use Tag Assistant on the custom production domain and GA Realtime/DebugView: one page_view on each full page load, no new view for #booking, one booking_click when following a Cliniko booking link and one phone_click on a call link. Check page_location has no query/fragment and custom parameters contain only fixed labels. Use browser Network tools to confirm one gtag.js load and one matching event hit. Confirm localhost and Netlify preview hosts make no Google tag/GA requests. Test opt-outs and any consent controls. Dashboard settings and live delivery must be verified with the GA account; local tests cannot confirm ingestion.

## Indexing verification and deployment

Run `node test-indexing.cjs` and `npm run build`. The default build targets production. To generate a local noindex build, set INDEXING_ENABLED=false. Tests build in a temporary directory and check all six sitemap pages, conflicting robots/googlebot tags, private-page fixtures, production/www host detection, preview and branch contexts, staging, the kill switch, canonical URLs and request-host headers.

Commit these changes and push to the Netlify production branch (main), then wait for a successful production deployment. In Netlify, check for old UI environment values or custom header rules that may still impose noindex; production needs INDEXING_ENABLED=true and SITE_URL=https://novamovementatelier.com.au. Do not change DNS or email records. The netlify/edge-functions/indexing-host-guard.js function must be included in the deployment so Netlify aliases remain restricted.

After deployment, inspect the live homepage and each sitemap service URL: HTTP success, no restrictive robots/googlebot tags or X-Robots-Tag header, production canonical, robots.txt allowing public crawling, and production URLs in sitemap.xml. Preview deployments must still return noindex. This repository build cannot verify extra restrictions added outside the repository.

Submit https://novamovementatelier.com.au/sitemap.xml in Google Search Console. In URL Inspection, inspect https://novamovementatelier.com.au/, choose Test live URL, confirm crawl allowed, successful fetch and indexing allowed, then choose Request indexing. Repeat for important service pages. Requesting indexing does not guarantee inclusion or immediate processing.
