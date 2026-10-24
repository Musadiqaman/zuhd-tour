import { reviewConfiguration } from '../services/reviews.js';
import { config } from '../config/env.js';

export async function reviewStatus(req, res) {
  const data = await reviewConfiguration();
  res.json({
    ...data,
    // An identifier alone is not proof that the third-party widget is live.
    missing: data.configured ? [] : ['ELFSIGHT_APP_ID'],
    message: data.configured
      ? 'App ID is configured. Open the homepage preview to check the published widget.'
      : config.elfsightAppId
        ? 'The App ID format is invalid. Copy only the ID after elfsight-app-, not the full HTML code.'
        : 'Add ELFSIGHT_APP_ID in backend/.env, then restart the backend.'
  });
}
