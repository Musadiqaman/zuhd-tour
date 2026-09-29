# Deploy this SEO build on Vercel

Use the existing project and domain. Root Directory: frontend.
The included vercel.json defines Framework: Other (null), Build Command: npm run build, Output Directory: dist, clean URLs and permanent redirects.

Run npm ci, npm run build, npm run check:seo. Deploy the updated source through the existing Git workflow. The build must include scripts/prerender.mjs; do not use only vite build.

Do not add a catch-all rewrite to index.html: pages now have real static HTML files, and unknown URLs must return 404. See SEO-UPDATE-2026-09-29.md for the migration and Search Console checklist.
