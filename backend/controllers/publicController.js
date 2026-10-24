import { Post, Settings } from '../models/index.js';
import { problem } from '../utils/security.js';
import { publicPost } from '../utils/content.js';
import { paging } from '../utils/request.js';
import { reviewConfiguration, defaultMapsUrl } from '../services/reviews.js';
export const publicPosts = async (req, res) => {
  const {
      page,
      limit
    } = paging(req.query),
    filter = {
      status: 'published'
    };
  const category = String(req.query.category || '').slice(0, 60);
  if (category) filter.category = category;
  const [items, total] = await Promise.all([Post.find(filter).sort({
    publishedAt: -1,
    _id: -1
  }).skip((page - 1) * limit).limit(limit).select('-content -html').lean(), Post.countDocuments(filter)]);
  res.set('Cache-Control', 'no-store').json({
    items: items.map(p => publicPost(p)),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit))
  });
};
export const publicPostBySlug = async (req, res) => {
  const slug = String(req.params.slug).slice(0, 100),
    p = await Post.findOne({
      slug,
      status: 'published'
    }).lean();
  res.set('Cache-Control', 'no-store');
  if (!p) throw problem('Guide not found.', 404);
  res.json({
    post: publicPost(p, true)
  });
};
export const publicReviews = async (req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    res.json(await reviewConfiguration());
  } catch {
    res.status(503).json({
      configured: false,
      mapsUrl: defaultMapsUrl,
      appId: ''
    });
  }
};
export async function publicSite(req, res) {
  const settings = await Settings.findById('site').select('socialLinks googleMapsUrl').lean();
  res.set('Cache-Control', 'no-store').json({
    socialLinks: settings?.socialLinks || {},
    googleMapsUrl: settings?.googleMapsUrl || defaultMapsUrl
  });
}
