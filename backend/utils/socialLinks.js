import { problem } from './security.js';
const platforms = {
  facebook: ['facebook.com', 'www.facebook.com', 'm.facebook.com', 'fb.com'],
  instagram: ['instagram.com', 'www.instagram.com'],
  youtube: ['youtube.com', 'www.youtube.com', 'youtu.be'],
  tiktok: ['tiktok.com', 'www.tiktok.com'],
  x: ['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'],
  linkedin: ['linkedin.com', 'www.linkedin.com']
};
export function validateSocialLinks(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw problem('Enter valid social profile links.');
  const out = {};
  for (const [platform, hosts] of Object.entries(platforms)) {
    const raw = String(value[platform] || '').trim();
    if (!raw) {
      out[platform] = '';
      continue;
    }
    let url;
    try {
      url = new URL(raw);
    } catch {
      throw problem(`Enter a complete HTTPS ${platform} profile URL.`);
    }
    if (raw.length > 500 || url.protocol !== 'https:' || !hosts.includes(url.hostname) || url.port || url.username || url.password || url.pathname === '/') throw problem(`Use your official HTTPS ${platform} profile link.`);
    out[platform] = url.href;
  }
  return out;
}
