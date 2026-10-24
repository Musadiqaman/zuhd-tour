# Zuhd Tours — frontend (v2.2)

Start with **`../backend/README.md`**. Both folders must stay side by side.

This frontend uses React + Vite. Pages keep the existing routes and search metadata. Static tour pages are prerendered; blogs are rendered on the Node backend from MongoDB.

## Local development

After installing both apps and setting the backend ENV:

```bash
npm run dev
```

The backend must also be running on port 4000. Or run `npm run dev:all` from the backend folder to start both apps. Open http://localhost:5173.

Local development does **not** need a frontend `.env`. Vite proxies API and media requests to the backend.

## Build

```bash
npm ci
npm run build
```

This generates `dist/` and `server-dist/` and checks prerendered SEO pages. Keep both outputs on your backend host. Vercel setup is in **DEPLOY.md**.

## October 23 changes

- Shorter header, smaller header/footer logos and restored active menu underline. Existing navigation font sizes preserved.
- Left social panel with larger icons. Mobile expand/collapse keeps the page usable. Configure real links in Admin → Settings → Social profiles.
- Seven supplied Dubai/Abu Dhabi photos replace the old photos on those city tour pages and cards. Family safari now has four gallery images.
- Subtle reveal animations for cards and selected sections. No animation library; content is visible without JavaScript and reduced-motion users get no reveal animation.
- Google reviews positioned after homepage safari cards. Elfsight uses one backend App ID; configure using the backend guide.
- New journal masthead, featured guide, cleaner cards, readable articles, heading navigation and responsive article sidebar.

The additional blog reference link mentioned in chat was not supplied, so the journal follows the existing navy/gold brand rather than an unprovided reference.

## SEO after this update

Existing tour/blog URLs are preserved. If `/sitemap.xml` is already submitted in Search Console, you do not need to delete/re-submit it after every CSS, photo or price change. Google revisits the sitemap. New published blog posts are included automatically by the backend sitemap route.

For an important new page or major content update, URL Inspection → Test live URL → Request indexing can be used once. Do not repeatedly request every page daily. Indexing/rankings are not guaranteed or instant.

Public article headings, canonical URLs, metadata and BlogPosting schema remain server-rendered. Admin pages are noindex. Do not mark up your own business reviews as eligible self-serving rating stars.

## Main files

- `src/components/` — header, footer, social/review panels, tour UI
- `src/pages/` — public pages
- `src/admin/` — admin UI and API client
- `src/data/` — tours, photos, routes, site configuration
- `src/hooks/` — reduced-motion-aware scroll reveal
- `src/styles/` — public page CSS
- `public/images/city-tours/` — new compressed city photos
- `api/proxy.js` — same-origin Vercel-to-backend adapter
- `scripts/` — prerender and SEO validation

Images and attribution notes are in `docs/`. Credentials, dependencies and build outputs are not included in the ZIP.

Google documentation: https://support.google.com/webmasters/answer/7451001 and https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
