import express from 'express';
import { isIP } from 'node:net';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { config } from './config/env.js';
import { originGuard } from './middlewares/auth.js';
import { equal } from './utils/security.js';
import { Post, Media } from './models/index.js';
import { publicPost, xmlEscape } from './utils/content.js';
import api from './routes/index.js';
import { pageRoutes, redirects } from '../frontend/src/data/seoRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  const widgetHosts = ['https://elfsightcdn.com', 'https://*.elfsightcdn.com', 'https://*.elfsight.com'];
  app.use(helmet({
    contentSecurityPolicy: config.production ? {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", ...widgetHosts],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', ...widgetHosts],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'https:', 'data:', 'blob:'],
        connectSrc: ["'self'", ...widgetHosts],
        frameSrc: ["'self'", 'https://www.google.com', ...widgetHosts],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"]
      }
    } : false,
    crossOriginEmbedderPolicy: false
  }));
  app.use((req, res, next) => {
    if (req.get('x-zuhd-proxy')) {
      if (!config.proxySecret || !equal(req.get('x-zuhd-proxy'), config.proxySecret)) return res.status(403).send('Invalid proxy credentials.');
      const clientIp = req.get('x-zuhd-client-ip');
      if (clientIp && isIP(clientIp)) req.zuhdClientIp = clientIp;
    }
    next();
  });
  app.use(cookieParser());
  app.use(originGuard);
  app.use(express.json({
    limit: '512kb'
  }));
  app.use('/api', api);
  app.get('/media/:filename', async (req, res) => {
    if (!/^[a-f0-9]{24}\.webp$/.test(req.params.filename)) return res.status(404).end();
    const image = await Media.findById(req.params.filename.slice(0, -5)).select('+data').lean();
    if (!image) return res.status(404).end();
    const etag = '"' + image.hash + '"';
    res.set({
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'ETag': etag,
      'X-Content-Type-Options': 'nosniff'
    });
    if (req.get('if-none-match') === etag) return res.status(304).end();
    res.send(Buffer.isBuffer(image.data) ? image.data : Buffer.from(image.data.buffer));
  });
  app.get('/sitemap.xml', async (req, res) => {
    const posts = await Post.find({
      status: 'published'
    }).select('slug updatedAt').lean();
    const staticRoutes = pageRoutes.filter(p => !p.startsWith('/blog/'));
    const urls = staticRoutes.map(p => `<url><loc>${xmlEscape(config.siteUrl + p)}</loc></url>`).concat(posts.map(p => `<url><loc>${xmlEscape(config.siteUrl + '/blog/' + p.slug)}</loc>${p.updatedAt ? `<lastmod>${p.updatedAt.toISOString()}</lastmod>` : ''}</url>`));
    res.type('application/xml').set('Cache-Control', 'no-store').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
  });
  app.get('/robots.txt', (req, res) => res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\n\nSitemap: ${config.siteUrl}/sitemap.xml\n`));
  const frontend = path.join(config.root, 'frontend'),
    dist = path.join(frontend, 'dist');
  let rendererPromise;
  async function renderPage(req, res, data, status = 200) {
    if (!existsSync(path.join(frontend, 'server-dist/entry-server.js')) || !existsSync(path.join(dist, 'app-shell.html'))) return res.status(503).type('text').send('Website build is not ready. Run npm run build.');
    rendererPromise ??= import(pathToFileURL(path.join(frontend, 'server-dist/entry-server.js')).href);
    const [{
      render
    }, template] = await Promise.all([rendererPromise, readFile(path.join(dist, 'app-shell.html'), 'utf8')]);
    const {
      head,
      body
    } = render(req.originalUrl, data);
    const encoded = JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
    const html = template.replace('<!--seo-head-->', () => head).replace('<!--seo-body-->', () => body).replace('</body>', () => `<script id="zuhd-page-data" type="application/json">${encoded}</script></body>`);
    res.status(status).type('html').set('Cache-Control', 'no-store').send(html);
  }
  app.get('/blog.html', (req, res) => res.redirect(301, '/blog'));
  app.get('/blog', async (req, res) => {
    const page = Math.max(1, Math.min(10000, Number.parseInt(req.query.page) || 1)),
      limit = 12;
    const [items, total] = await Promise.all([Post.find({
      status: 'published'
    }).sort({
      publishedAt: -1,
      _id: -1
    }).skip((page - 1) * limit).limit(limit).select('-content -html').lean(), Post.countDocuments({
      status: 'published'
    })]);
    if (page > 1 && items.length === 0) return renderPage(req, res, {
      blog: {
        items: [],
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    }, 404);
    await renderPage(req, res, {
      blog: {
        items: items.map(p => publicPost(p)),
        total,
        page,
        pages: Math.max(1, Math.ceil(total / limit))
      }
    });
  });
  app.get('/blog/:slug', async (req, res) => {
    const post = await Post.findOne({
      slug: req.params.slug,
      status: 'published'
    }).lean();
    await renderPage(req, res, post ? {
      post: publicPost(post, true)
    } : {
      notFound: true
    }, post ? 200 : 404);
  });
  for (const [from, to] of Object.entries(redirects)) app.get(from, (req, res) => res.redirect(301, to));
  app.use('/admin', (req, res, next) => {
    if (req.method !== 'GET') return next();
    res.set({
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store'
    });
    if (!existsSync(path.join(dist, 'admin.html'))) return res.status(503).send('Admin build is not ready. Run npm run build.');
    res.sendFile(path.join(dist, 'admin.html'));
  });
  app.use(express.static(dist, {
    extensions: ['html'],
    index: 'index.html',
    setHeaders: (res, file) => {
      if (/\/assets\//.test(file)) res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));
  app.use((req, res) => {
    if (existsSync(path.join(dist, '404.html'))) res.status(404).sendFile(path.join(dist, '404.html'));else res.status(404).send('Page not found.');
  });
  app.use(errorHandler);
  return app;
}
