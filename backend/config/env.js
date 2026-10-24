import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
// Resolve ENV from the backend folder, independent of the launch directory.
dotenv.config({ path: path.join(root, 'backend/.env'), quiet: true });
const production = process.env.NODE_ENV === 'production';
export const config = {
  root,
  production,
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || (production ? '0.0.0.0' : '127.0.0.1'),
  mongo: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zuhd_tours',
  siteUrl: (process.env.PUBLIC_SITE_URL || 'https://www.zuhdtours.com').replace(/\/$/, ''),
  setupToken: process.env.SETUP_TOKEN || '',
  proxySecret: process.env.PROXY_SECRET || '',
  trustProxy: process.env.TRUST_PROXY === '1' ? 1 : false,
  elfsightAppId: process.env.ELFSIGHT_APP_ID || '',
  sessionMs: 8 * 60 * 60 * 1000
};
const siteOrigins = [config.siteUrl];
try {
  const canonical = new URL(config.siteUrl);
  if (canonical.hostname.startsWith('www.')) {
    canonical.hostname = canonical.hostname.slice(4);
    siteOrigins.push(canonical.origin);
  }
} catch { /* validateConfig reports an invalid site URL. */ }
config.origins = new Set([...siteOrigins, ...(process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean), ...(!production ? ['http://localhost:5173', 'http://127.0.0.1:5173', `http://localhost:${config.port}`, `http://127.0.0.1:${config.port}`] : [])]);
export function validateConfig() {
  if (!config.mongo) throw Error('MONGODB_URI is required.');
  if (config.setupToken && config.setupToken.length < 32) throw Error('SETUP_TOKEN must contain at least 32 random characters. Run npm run setup for a new installation.');
  if (!/^https?:\/\//.test(config.siteUrl)) throw Error('PUBLIC_SITE_URL must be a complete URL.');
  if (production && !config.siteUrl.startsWith('https://')) throw Error('Production PUBLIC_SITE_URL must use HTTPS.');
}
