// Isolated real MongoDB + HTTP integration checks. Never uses the configured production database.
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import path from 'node:path';
import { PassThrough } from 'node:stream';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { MongoMemoryServer } from 'mongodb-memory-server';
process.env.NODE_ENV = 'test';
process.env.SETUP_TOKEN = randomBytes(32).toString('hex');
process.env.PROXY_SECRET = randomBytes(32).toString('hex');
process.env.ELFSIGHT_APP_ID = '';
process.env.MONGOMS_DOWNLOAD_IGNORE_MISSING_HEADER = 'true';
const {
  Media,
  Settings
} = await import('../models/index.js');
const { config } = await import('../config/env.js');
const {
  seedExistingGuides
} = await import('../services/seed.js');
const { default: app } = await import('../app.js');
const {
  sha
} = await import('../utils/security.js');
let mongo,
  server,
  dbPath,
  cookie = '',
  csrf = '',
  checks = 0;
function passed(label) {
  checks++;
  console.log('PASS:', label);
}
try {
  dbPath = await mkdtemp(path.resolve('.test-mongo-'));
  mongo = await MongoMemoryServer.create({
    instance: {
      dbPath,
      args: ['--nounixsocket'],
      storageEngine: 'wiredTiger'
    }
  });
  config.mongo = mongo.getUri();
  assert.equal(mongoose.connection.readyState, 0, 'Importing app must not connect during build');
  server = app.listen(0, '127.0.0.1');
  await new Promise(r => server.once('listening', r));
  const base = 'http://127.0.0.1:' + server.address().port;
  const validSetupToken = config.setupToken;
  config.setupToken = 'short';
  const failedStartup = await fetch(base + '/api/health');
  assert.equal(failedStartup.status, 500);
  assert.deepEqual(await failedStartup.json(), { error: 'Something went wrong. Please try again.' });
  assert.equal(mongoose.connection.readyState, 0);
  config.setupToken = validSetupToken;
  passed('failed initialization returns a safe response and allows a later retry');
  await Promise.all(Array.from({ length: 4 }, async () => {
    const response = await fetch(base + '/api/health');
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { ok: true, database: true });
  }));
  await seedExistingGuides();
  passed('Vercel default entry initializes MongoDB for simultaneous cold requests');
  async function request(path, method = 'GET', body, options = {}) {
    const headers = {
      origin: 'http://localhost:5173',
      ...(cookie ? {
        cookie
      } : {}),
      ...(csrf ? {
        'x-csrf-token': csrf
      } : {}),
      ...options.headers
    };
    if (options.noCsrf) delete headers['x-csrf-token'];
    if (options.anonymous) delete headers.cookie;
    if (body && !(body instanceof FormData)) headers['content-type'] = 'application/json';
    const res = await fetch(base + path, {
      method,
      headers,
      body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined
    });
    if (res.headers.get('set-cookie') && !options.keepCookie) cookie = res.headers.get('set-cookie').split(';')[0];
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {};
    }
    return {
      res,
      status: res.status,
      text,
      data
    };
  }
  assert.equal((await request('/api/admin/posts')).status, 401);
  assert.equal((await request('/api/auth/status')).data.initialized, false);
  passed('unauthenticated admin access is blocked');
  assert.equal((await request('/api/auth/setup', 'POST', {
    setupToken: 'wrong'
  })).status, 403);
  let r = await request('/api/auth/setup', 'POST', {
    name: 'Test Owner',
    email: 'owner@example.test',
    password: 'An isolated test password 42',
    setupToken: process.env.SETUP_TOKEN
  });
  assert.equal(r.status, 201, r.text);
  csrf = r.data.csrfToken;
  assert(cookie);
  assert(/HttpOnly/i.test(r.res.headers.get('set-cookie')));
  assert(!r.text.includes('passwordHash'));
  assert.equal((await request('/api/auth/setup', 'POST', {})).status, 409);
  assert.equal((await request('/api/admin/dashboard')).data.counts.published, 7);
  passed('one-time setup, safe cookies and existing-guide migration');
  assert.equal((await request('/api/admin/posts', 'POST', {}, {
    noCsrf: true
  })).status, 403);
  assert.equal((await request('/api/admin/posts', 'POST', {}, {
    headers: {
      origin: 'https://attacker.example'
    }
  })).status, 403);
  passed('CSRF and foreign-origin writes are blocked');
  const input = {
    title: 'Integration safari story',
    slug: 'integration-safari-story',
    excerpt: 'Practical travel advice for a morning in the dunes.',
    content: '## Before your trip\n\nUnique article body for server rendering.\n\n<script>window.pwned=true</script>',
    status: 'draft',
    category: 'Desert Safari',
    author: 'Zuhd Tours Team',
    seoTitle: 'Plan a morning in the dunes',
    seoDescription: 'Useful preparation for a morning safari in Dubai.'
  };
  r = await request('/api/admin/posts', 'POST', input);
  assert.equal(r.status, 201, r.text);
  let post = r.data.post;
  assert.equal((await request('/api/public/posts/' + input.slug)).status, 404);
  assert.equal((await request('/blog/' + input.slug)).status, 404);
  assert(!(await request('/sitemap.xml')).text.includes(input.slug));
  passed('drafts stay out of public APIs, pages and sitemap');
  const form = new FormData(),
    pixel = await sharp({
      create: {
        width: 120,
        height: 80,
        channels: 3,
        background: '#b48444'
      }
    }).png().toBuffer();
  form.append('image', new Blob([pixel], {
    type: 'image/png'
  }), 'dunes.png');
  form.append('alt', 'Golden dunes for the test article');
  r = await request('/api/admin/media', 'POST', form);
  assert.equal(r.status, 201, r.text);
  const image = r.data.image;
  const media = await Media.findById(image.id).select('+data');
  const served = await fetch(base + image.url);
  const bytes = Buffer.from(await served.arrayBuffer());
  assert.equal(sha(bytes), media.hash);
  assert.equal(served.headers.get('content-type'), 'image/webp');
  assert.equal((await sharp(bytes).metadata()).width, 120);
  passed('upload, WebP processing and exact image-byte delivery');
  const duplicate = await request('/api/admin/media', 'POST', form);
  assert.equal(duplicate.status, 200);
  assert.equal(duplicate.data.image.id, image.id);
  assert.equal(duplicate.data.image.reused, true);
  const library = (await request('/api/admin/media')).data;
  assert.equal(library.total, 1);
  assert.equal(library.storage.bytes, image.size);
  assert.equal(library.storage.originalBytes, pixel.length);
  assert(!('data' in library.items[0]));
  passed('duplicate images reuse storage and media totals are accurate');
  assert.equal((await request('/api/admin/reviews')).data.configured, false);
  assert.equal((await request('/api/admin/reviews', 'GET', null, {
    anonymous: true
  })).status, 401);
  assert.equal((await request('/api/public/reviews')).data.appId, '');
  config.elfsightAppId = '<script>alert(1)</script>';
  assert.equal((await request('/api/admin/reviews')).data.configured, false);
  assert.equal((await request('/api/public/reviews')).data.appId, '');
  config.elfsightAppId = '11111111-2222-4333-8444-555555555555';
  const widget = (await request('/api/public/reviews')).data;
  assert.equal(widget.configured, true);
  assert.equal(widget.appId, config.elfsightAppId);
  assert(!JSON.stringify(widget).includes(process.env.SETUP_TOKEN));
  assert.equal(widget.rating, undefined);
  assert.equal(widget.count, undefined);
  assert.equal((await request('/api/admin/reviews')).data.configured, true);
  passed('review config validates the widget ID, exposes no secrets and invents no rating');
  r = await request('/api/admin/settings', 'PUT', {
    socialLinks: {
      instagram: 'https://www.instagram.com/zuhdtours/'
    }
  });
  assert.equal(r.status, 200, r.text);
  const publicSite = (await request('/api/public/site')).data;
  assert.equal(publicSite.socialLinks.instagram, 'https://www.instagram.com/zuhdtours/');
  assert(!JSON.stringify(publicSite).includes('googleApiKey'));
  assert.equal((await request('/api/admin/settings', 'PUT', {
    socialLinks: {
      instagram: 'https://instagram.com.evil.test/x'
    }
  })).status, 400);
  passed('social profiles publish safely without private settings');
  r = await request('/api/admin/posts/' + post._id, 'PUT', {
    ...post,
    image: image.url,
    imageAlt: image.alt,
    status: 'published'
  });
  assert.equal(r.status, 200, r.text);
  post = r.data.post;
  const article = await request('/blog/' + input.slug);
  assert.equal(article.status, 200, article.text);
  assert(article.text.includes('<h2 id="guide-section-1">Before your trip</h2>'));
  assert(article.text.includes('Plan a morning in the dunes | Zuhd Tours'));
  assert(article.text.includes('application/ld+json'));
  assert(!article.text.includes('window.pwned'));
  assert((await request('/sitemap.xml')).text.includes(input.slug));
  assert((await request('/api/public/posts')).data.items.some(p => p.slug === input.slug));
  passed('published article has server-rendered content, SEO and automatic sitemap entry');
  assert.equal((await request('/api/admin/posts/' + post._id, 'PUT', {
    ...post,
    version: 1
  })).status, 409);
  assert.equal((await request('/api/admin/posts/' + post._id, 'PUT', {
    ...post,
    slug: 'changed-url'
  })).status, 400);
  assert.equal((await request('/api/admin/media/' + image.id, 'DELETE', {})).status, 409);
  assert.equal((await request('/api/admin/posts/' + post._id, 'DELETE', {
    version: post.version
  })).status, 409);
  passed('edit conflict, stable published URL and used-image protections');
  const publicData = (await request('/api/public/posts/' + input.slug)).data;
  assert(!JSON.stringify(publicData).includes('"content":'));
  assert(!JSON.stringify(publicData).includes('seedKey'));
  assert.equal((await request('/some-missing-url')).status, 404);
  assert((await request('/admin')).res.headers.get('x-robots-tag').includes('noindex'));
  passed('public DTOs, real 404 responses and noindex admin');
  r = await request('/api/admin/settings', 'PUT', {
    googleMapsUrl: 'https://maps.app.goo.gl/xFMfxpXM7EULLtuJ6',
    reviewsEnabled: false,
    defaultAuthor: 'Zuhd Tours Editorial'
  });
  assert.equal(r.status, 200, r.text);
  assert.equal((await request('/api/public/reviews')).data.enabled, false);
  passed('review visibility can be changed without an API key or extra ENV');
  // Exercise the Vercel adapter with parsed JSON and raw multipart bodies against this real app.
  const proxy = (await import('../../frontend/api/proxy.js')).default,
    realFetch = global.fetch;
  process.env.BACKEND_ORIGIN = 'https://backend.example.test';
  global.fetch = (url, opts) => {
    const u = new URL(url);
    if (u.hostname === 'backend.example.test') {
      assert.equal(opts.headers.get('x-zuhd-proxy'), process.env.PROXY_SECRET);
      return realFetch(base + u.pathname + u.search, opts);
    }
    return realFetch(url, opts);
  };
  async function throughProxy(route, method, body, contentType, raw = false) {
    let code = 200,
      headers = {},
      payload;
    const req = {
      url: '/api/proxy?path=' + encodeURIComponent(route),
      query: {
        path: route
      },
      method,
      headers: {
        cookie,
        'x-csrf-token': csrf,
        origin: 'http://localhost:5173',
        ...(contentType ? {
          'content-type': contentType
        } : {})
      },
      body
    };
    if (raw) {
      const stream = new PassThrough();
      req.body = undefined;
      req.on = stream.on.bind(stream);
      stream.end(body);
    }
    const res = {
      setHeader(k, v) {
        headers[k.toLowerCase()] = v;
      },
      status(n) {
        code = n;
        return this;
      },
      json(x) {
        payload = Buffer.from(JSON.stringify(x));
        return this;
      },
      end(x) {
        payload = x;
        return this;
      }
    };
    await proxy(req, res);
    return {
      code,
      headers,
      data: payload ? JSON.parse(payload.toString()) : null
    };
  }
  try {
    let pr = await throughProxy('auth/invalid', 'GET');
    assert.equal(pr.code, 404);
    pr = await throughProxy('api/auth/me', 'GET');
    assert.equal(pr.code, 200);
    const rawForm = new FormData();
    rawForm.append('image', new Blob([pixel], {
      type: 'image/png'
    }), 'proxy.png');
    const wire = new Request('https://local.test', {
        method: 'POST',
        body: rawForm
      }),
      wireBytes = Buffer.from(await wire.arrayBuffer());
    pr = await throughProxy('api/admin/media', 'POST', wireBytes, wire.headers.get('content-type'));
    assert.equal(pr.code, 200);
    assert.equal(pr.data.image.reused, true);
    pr = await throughProxy('api/admin/media', 'POST', wireBytes, wire.headers.get('content-type'), true);
    assert.equal(pr.code, 200, JSON.stringify(pr.data));
    assert.equal(pr.data.image.reused, true);
    pr = await throughProxy('api/auth/login', 'POST', {
      email: 'owner@example.test',
      password: 'An isolated test password 42'
    }, 'application/json');
    assert.equal(pr.code, 200);
    assert(pr.headers['set-cookie'].length);
  } finally {
    global.fetch = realFetch;
  }
  passed('Vercel bridge forwards authentication, parsed JSON and multipart uploads');
  r = await request('/api/admin/posts/' + post._id + '/status', 'PATCH', {
    status: 'draft',
    version: post.version
  });
  assert.equal(r.status, 200);
  post = r.data.post;
  assert.equal((await request('/blog/' + input.slug)).status, 404);
  assert(!(await request('/sitemap.xml')).text.includes(input.slug));
  passed('unpublishing removes public content and sitemap entry');
  const oldCookie = cookie;
  r = await request('/api/auth/password', 'POST', {
    currentPassword: 'wrong',
    newPassword: 'A changed test password 123'
  });
  assert.equal(r.status, 400);
  r = await request('/api/auth/password', 'POST', {
    currentPassword: 'An isolated test password 42',
    newPassword: 'A changed test password 123'
  });
  assert.equal(r.status, 200, r.text);
  csrf = r.data.csrfToken;
  assert.equal((await request('/api/auth/me', 'GET', null, {
    headers: {
      cookie: oldCookie
    },
    keepCookie: true
  })).status, 401);
  assert.equal((await request('/api/auth/login', 'POST', {
    email: 'owner@example.test',
    password: 'An isolated test password 42'
  })).status, 401);
  r = await request('/api/auth/login', 'POST', {
    email: 'owner@example.test',
    password: 'A changed test password 123'
  });
  assert.equal(r.status, 200);
  csrf = r.data.csrfToken;
  passed('password changes rotate sessions and invalidate the old password');
  r = await request('/api/auth/logout', 'POST', {});
  assert.equal(r.status, 200);
  assert.equal((await request('/api/admin/posts')).status, 401);
  passed('logout invalidates the session');
  await mongoose.disconnect();
  const reconnected = await request('/api/health');
  assert.equal(reconnected.status, 200);
  assert.deepEqual(reconnected.data, { ok: true, database: true });
  assert.equal((await request('/api/auth/status')).data.initialized, true);
  passed('a warm function reconnects without resetting the existing admin');
  console.log(`\n${checks} integration scenarios passed.`);
} finally {
  if (server) await new Promise(r => server.close(r));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
  if (dbPath) await rm(dbPath, {
    recursive: true,
    force: true
  });
}
