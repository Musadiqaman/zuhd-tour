// Same-origin bridge: browser cookies and API keys never need cross-origin access.
// BACKEND_ORIGIN and PROXY_SECRET are private Vercel environment variables.
const allowedPath = /^(?:api\/(?:health|(?:auth|admin|public)(?:\/[a-zA-Z0-9_-]+)*)|media\/[a-f0-9]{24}\.webp|blog(?:\/[a-z0-9-]+)?|sitemap\.xml)$/;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const incoming = new URL(req.url, 'https://proxy.invalid');
  const route = String(req.query?.path || incoming.searchParams.get('path') || '');
  if (!allowedPath.test(route)) return res.status(404).json({ error: 'Route not found.' });
  let backend;
  try {
    backend = new URL(process.env.BACKEND_ORIGIN);
    if (backend.protocol !== 'https:' || backend.username || backend.password || backend.pathname !== '/') throw Error();
  } catch {
    return res.status(503).json({ error: 'The backend is not connected. Set BACKEND_ORIGIN in Vercel, then redeploy.' });
  }
  if (!process.env.PROXY_SECRET || process.env.PROXY_SECRET.length < 32) return res.status(503).json({ error: 'Set the same private PROXY_SECRET on Vercel and the backend, then redeploy.' });
  const target = new URL('/' + route, backend);
  incoming.searchParams.delete('path');
  target.search = incoming.searchParams.toString();
  const headers = new Headers({ 'x-zuhd-proxy': process.env.PROXY_SECRET });
  for (const name of ['content-type', 'accept', 'cookie', 'x-csrf-token', 'origin', 'sec-fetch-site', 'if-none-match']) {
    if (typeof req.headers[name] === 'string') headers.set(name, req.headers[name]);
  }
  // The backend only trusts this client address when our shared secret matches.
  const clientIp = req.headers['x-vercel-forwarded-for'] || req.headers['x-forwarded-for'];
  if (typeof clientIp === 'string') headers.set('x-zuhd-client-ip', clientIp.split(',')[0].trim());
  try {
    let body;
    if (!['GET', 'HEAD'].includes(req.method)) {
      if (Buffer.isBuffer(req.body) || typeof req.body === 'string') body = req.body;
      else if (req.body != null) body = JSON.stringify(req.body);
      else {
        // Vercel restores raw multipart bodies through data/end listeners.
        // Read those events so binary uploads also work when req.body is undefined.
        body = await new Promise((resolve, reject) => {
          const chunks = []; let size = 0;
          req.on('data', chunk => { size += chunk.length; if (size > 4.4 * 1024 * 1024) reject(Object.assign(Error('Image too large'), { status: 413 })); else chunks.push(Buffer.from(chunk)); });
          req.on('end', () => resolve(Buffer.concat(chunks)));
          req.on('error', reject);
        });
      }
    }
    const response = await fetch(target, { method: req.method, headers, body, redirect: 'manual', signal: AbortSignal.timeout(25000) });
    for (const name of ['content-type', 'cache-control', 'etag', 'x-robots-tag', 'content-security-policy', 'x-content-type-options', 'referrer-policy', 'retry-after']) {
      if (response.headers.has(name)) res.setHeader(name, response.headers.get(name));
    }
    const cookies = response.headers.getSetCookie();
    if (cookies.length) res.setHeader('Set-Cookie', cookies);
    if (response.status >= 300 && response.status < 400 && response.status !== 304) return res.status(502).json({ error: 'The backend returned an unexpected redirect. Check BACKEND_ORIGIN.' });
    res.status(response.status);
    if (req.method === 'HEAD' || [204, 304].includes(response.status)) return res.end();
    return res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    if (error.status === 413) return res.status(413).json({ error: 'Choose an image smaller than 4 MB.' });
    if (error.statusCode === 400) return res.status(400).json({ error: 'Invalid request body.' });
    return res.status(502).json({ error: 'The server could not be reached. Please try again shortly.' });
  }
}
