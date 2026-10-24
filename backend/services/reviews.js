import { Settings } from '../models/index.js';
import { config } from '../config/env.js';

export const defaultMapsUrl = 'https://maps.app.goo.gl/xFMfxpXM7EULLtuJ6';

// Accept only a widget identifier, never HTML or arbitrary executable code.
export function widgetId(value = '') {
  const id = String(value).trim().replace(/^elfsight-app-/i, '');
  return /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id) ? id.toLowerCase() : '';
}

export async function reviewConfiguration() {
  const settings = await Settings.findById('site').select('reviewsEnabled googleMapsUrl').lean();
  const appId = widgetId(config.elfsightAppId);
  return {
    provider: 'elfsight',
    enabled: settings?.reviewsEnabled !== false,
    configured: Boolean(appId),
    appId,
    mapsUrl: settings?.googleMapsUrl || defaultMapsUrl
  };
}
