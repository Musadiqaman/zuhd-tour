# Zuhd Tours: technical SEO update

## Included
- Canonical domain: https://www.zuhdtours.com, matching the supplied Vercel domain settings.
- Build-time rendering of 36 real pages, each with content, one title, description, canonical and structured data in the initial HTML. No new runtime service or paid dependency.
- Sitemap and robots.txt generated from the real route catalogue. Removed seven invalid /tours/ URLs that were actually blog slugs; added missing pages and excluded redirected aliases.
- Permanent redirects for observed WordPress home, contact, tour listing, article listing and four tour booking URLs. Three duplicate tour routes also consolidate to their canonical pages.
- Removed the catch-all homepage rewrite. Vercel serves generated HTML through clean URLs and a custom 404.html for missing pages. Unknown client-side blog/tour routes also receive noindex metadata.
- Removed conflicting static homepage metadata; Helmet manages page-specific tags.
- Corrected the broken About image path and made language preference storage safe during server rendering or blocked browser storage.
- Changed the blanket one-year immutable cache for unversioned images to one-hour revalidation, allowing replacement images to update sooner.
- Omitted the unconfirmed street address from structured data because the supplied code contains conflicting office addresses. The visible business details have not been guessed or replaced.

## Deployment
1. Copy the updated frontend files into the existing project, including scripts/, src/entry-server.jsx, src/data/seoRoutes.js, package.json and vercel.json. Keep the existing Git repository.
2. Vercel Root Directory stays frontend. vercel.json selects static output (framework null / Other), runs npm run build and publishes dist. Do not restore the old catch-all rewrite or replace the build command with just vite build: prerendering is required.
3. Run npm ci, npm run build and npm run check:seo locally if desired, then push/deploy the updated code using the normal workflow.
4. Keep the existing apex-to-www domain redirect. Do not change HostGator nameservers again.
5. After deployment, verify /, /tours/dubai-city-tour, /sitemap.xml and /robots.txt; /booking/desert-safari/ must redirect to /desert-safari-dubai-tours and an invented URL must return HTTP 404. Confirm these on Vercel itself; local emulation is not a live deployment test.
6. Inspect View Source on a tour: its title, canonical and main content should be present without JavaScript.

## Validation performed
- npm ci and npm run build passed.
- npm run check:seo passed across all 36 pages: unique titles, single canonical/description/H1, parseable JSON-LD, all referenced local assets/internal paths, sitemap contents and 11 redirect mappings.
- A real browser test was attempted but could not run because the browser binary download failed. Visual appearance, client interactions and deployed HTTP responses still need verification after deployment.

## Still needs owner input / separate account setup
- Confirm priority tour and target customer countries before keyword/content expansion.
- Confirm the real address: source config says Bur Dubai–Al Raffa, but the contact page says Street 15 House no 11 Al Jaflia. Confirm the current phone numbers too; the old WordPress footer and new site differ.
- Owner confirmed safari location is Dubai. Safari page, tour data, metadata and structured data now agree. Removed the previous named camp reference to avoid assigning that camp to Dubai. Pickup/drop-off coverage still needs confirmation; the text asks customers to confirm with the team.
- Verify published prices, review counts and ratings. The old WordPress reviews include apparent theme/demo text; do not present unverified reviews as genuine customer evidence.
- Blog pages currently repeat generic short paragraphs. They need useful, distinct content before expecting competitive rankings.
- Gallery includes generated images. Replace with authentic tour photography where available and do not imply generated people are actual customers.
- Contact form currently prevents submission without sending anything. Booking form opens WhatsApp without including entered details. These existing conversion issues need a separate form update.
- Arabic is a browser preference on the same URLs, not an independently indexable Arabic site. Separate translated routes/hreflang were not invented.
- Full old WordPress URL inventory is not available. The confirmed matching redirects are included; old articles, demo events, policies and destinations require review/export. Do not redirect unrelated missing pages to home.
- No Search Console ownership verification, sitemap submission, Analytics or Business Profile account action has been performed.
- No live deployment, Lighthouse score or ranking guarantee is claimed.

## Search Console next step after deployment
Open https://search.google.com/search-console and add the Domain property zuhdtours.com. If it is not already verified, copy Google's exact TXT value into the domain DNS on Vercel (the active nameserver provider), then verify. Submit https://www.zuhdtours.com/sitemap.xml. Inspect the homepage and priority tour using the live URL test. Do not use Change of Address for this hosting-only migration on the same domain.

## Maintenance
Add new static pages to src/data/seoRoutes.js. Tour and blog records are discovered automatically from siteData.js. Keep redirects in that module and vercel.json consistent; npm run check:seo checks this. Every build regenerates route HTML, sitemap and robots.txt. No artificial lastmod dates are emitted.

## References
- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://vercel.com/docs/project-configuration/vercel-json
- Observed old URLs: https://zuhdtours.com/ and linked /booking/desert-safari/, /booking/abu-dhabi-city-tour/, /booking/dubai-city-tour/, /booking/global-village-dubai/, /tour-packages/, /articles/, /contact_us/ and indexed /home/.
