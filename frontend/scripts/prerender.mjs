import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { pageRoutes } from '../src/data/seoRoutes.js';
import { site } from '../src/data/siteConfig.js';

const template = await readFile('dist/index.html', 'utf8');
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom', ssr: { noExternal: ['react-helmet-async'] } });
try {
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx');
  for (const path of [...pageRoutes, '/404']) {
    const { head, body } = render(path);
    const file = path === '/' ? 'dist/index.html' : `dist${path}.html`;
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, template.replace('<!--seo-head-->', () => head).replace('<!--seo-body-->', () => body));
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pageRoutes.map(path => `  <url><loc>${site.domain}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
  const robots = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /_debug/\n\nSitemap: ${site.domain}/sitemap.xml\n`;
  for (const dir of ['public', 'dist']) {
    await writeFile(`${dir}/sitemap.xml`, sitemap);
    await writeFile(`${dir}/robots.txt`, robots);
  }
  console.log(`Prerendered ${pageRoutes.length} pages and a custom 404. Sitemap regenerated from real routes.`);
} finally {
  await server.close();
}
