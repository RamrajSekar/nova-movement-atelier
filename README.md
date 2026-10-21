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

- `SERVICE_PAGES_ENABLED=true` enables the three service pages, card links and sitemap entries. Set to `false` and redeploy to disable them.
- `INDEXING_ENABLED=false` keeps temporary deployments out of search using both robots metadata and an HTTP header. This is not password protection.
- `SITE_URL` optionally overrides the absolute canonical and sitemap origin. By default the Netlify deployment URL is used.

The flags are defined in `netlify.toml`. Change them there and push a commit to trigger a deployment.

Before public launch: complete mobile/browser QA, have the clinic approve copy and image usage, set the final domain, review redirects, and enable indexing. The booking buttons currently open the clinic's existing Cliniko service.

## Source notes

The repository contains the current approved design and only the image assets it references. The practitioner portrait was enhanced with AI and should be approved by Suren before public release. Hosting credentials and Sites-specific metadata are excluded.
