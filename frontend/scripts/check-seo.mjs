import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { pageRoutes, redirects } from '../src/data/seoRoutes.js';
import { site } from '../src/data/siteConfig.js';
const titles = new Set();
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
for (const path of pageRoutes) {
  const html = await readFile(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
  const title = html.match(/<title[^>]*>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `Missing/duplicate title: ${path}`); titles.add(title);
  assert.equal((html.match(/<link\b[^>]*rel="canonical"/g) || []).length, 1, `Canonical count: ${path}`);
  assert(html.includes(`href="${site.domain}${path}"`), `Canonical mismatch: ${path}`);
  assert.equal((html.match(/<meta\b[^>]*name="description"/g) || []).length, 1, `Description count: ${path}`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `H1 count: ${path}`);
  assert(!html.includes('content="noindex'), `Unexpected noindex: ${path}`);
  assert(sitemap.includes(`<loc>${site.domain}${path}</loc>`), `Sitemap missing: ${path}`);
  for (const match of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(match[1]);
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]*)/g)) {
    const target = match[1];
    if (pageRoutes.includes(target) || redirects[target]) continue;
    await access(`dist${target}`).catch(() => { throw new Error(`Missing local resource ${target} on ${path}`); });
  }
}
assert.equal((sitemap.match(/<loc>/g)||[]).length, pageRoutes.length);
const config = JSON.parse(await readFile('vercel.json','utf8'));
assert(!config.rewrites, 'A catch-all rewrite would cause soft 404s');
assert.equal(config.framework, null);
for (const [from,to] of Object.entries(redirects)) {
  assert(pageRoutes.includes(to), `Invalid redirect target: ${from}`);
  assert(config.redirects.some(r=>r.source===from && r.destination===to && r.permanent));
}
assert((await readFile('dist/404.html','utf8')).includes('noindex,follow'));
console.log(`PASS: ${pageRoutes.length} pages; unique titles, single canonicals/descriptions/H1s, JSON-LD, local assets/links, sitemap, ${Object.keys(redirects).length} redirects and 404 configuration.`);
