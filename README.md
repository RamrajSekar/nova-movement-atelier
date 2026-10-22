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
- `INDEXING_ENABLED=false` keeps temporary deployments out of search using both robots metadata and an HTTP header. This is not password protection.
- `SITE_URL` optionally overrides the absolute canonical and sitemap origin. By default the Netlify deployment URL is used.

The flags are defined in `netlify.toml`. Change them there and push a commit to trigger a deployment.

Before public launch: complete mobile/browser QA, have the clinic approve copy and image usage, set the final domain, review redirects, and enable indexing. The booking buttons currently open the clinic's existing Cliniko service.

## Source notes

The repository contains the current approved design and only the image assets it references. The practitioner portrait was enhanced with AI and should be approved by Suren before public release. Hosting credentials and Sites-specific metadata are excluded.

## Featured certificates

Edit `featuredCertificates` at the top of `certificates.json` to choose the three initially visible certificates. List exactly three certificate IDs in the desired order, then run `npm run build`. The remaining certificates keep their order from the `certificates` array. The enlarged viewer follows the featured three, then the remaining certificates. Unknown or duplicate IDs fail the build with a clear error.

Current featured certificates: Vestibular competency (2025), TMD (2025), and Sports Physiotherapy Level 2 (2024).
