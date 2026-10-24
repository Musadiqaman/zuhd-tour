import { Settings } from '../models/index.js';
import { problem } from '../utils/security.js';
import { text } from '../utils/content.js';
import { reviewConfiguration, defaultMapsUrl } from '../services/reviews.js';
import { validateSocialLinks } from '../utils/socialLinks.js';
export async function safeSettings() {
  const s = await Settings.findById('site').lean(),
    c = await reviewConfiguration();
  return {
    googleMapsUrl: c.mapsUrl,
    reviewsEnabled: c.enabled,
    defaultAuthor: s?.defaultAuthor || 'Zuhd Tours Team',
    socialLinks: s?.socialLinks || {}
  };
}
export async function getSettings(req, res) {
  res.json({
    settings: await safeSettings()
  });
}
export async function updateSettings(req, res) {
  const values = {},
    body = req.body || {};
  if (Object.hasOwn(body, 'googleMapsUrl')) {
    const mapsUrl = text(body.googleMapsUrl, 2000) || defaultMapsUrl;
    let u;
    try {
      u = new URL(mapsUrl);
    } catch {
      throw problem('Enter a valid Google Maps URL.');
    }
    if (u.protocol !== 'https:' || u.username || u.password || !['maps.app.goo.gl', 'www.google.com', 'maps.google.com', 'search.google.com'].includes(u.hostname)) throw problem('Use the business’s official Google Maps link.');
    values.googleMapsUrl = mapsUrl;
  }
  if (Object.hasOwn(body, 'reviewsEnabled')) values.reviewsEnabled = body.reviewsEnabled !== false;
  if (Object.hasOwn(body, 'defaultAuthor')) values.defaultAuthor = text(body.defaultAuthor, 100) || 'Zuhd Tours Team';
  if (Object.hasOwn(body, 'socialLinks')) values.socialLinks = validateSocialLinks(body.socialLinks);
  await Settings.findByIdAndUpdate('site', {
    $set: values
  }, {
    upsert: true,
    new: true,
    runValidators: true
  });
  res.json({
    settings: await safeSettings()
  });
}
