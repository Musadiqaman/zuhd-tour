import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Run only for the frontend Vercel deployment, after the full SEO build checks.
// Static files take priority over Vercel rewrites. These paths must reach the
// backend so published, edited and archived posts also update HTML and sitemap.
// Ordinary local/backend builds keep their complete prerendered output.
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
for (const name of ['blog.html', 'blog', 'sitemap.xml']) {
  await rm(path.join(dist, name), { recursive: true, force: true });
}
console.log('Vercel output ready: blog pages and sitemap are served by the backend.');
