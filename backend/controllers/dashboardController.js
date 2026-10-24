import { Post, Media } from '../models/index.js';
import { safeAdmin } from '../utils/security.js';
export const getDashboard = async (req, res) => {
  const [published, draft, archived, media, recent] = await Promise.all(['published', 'draft', 'archived'].map(status => Post.countDocuments({
    status
  })).concat([Media.countDocuments({}), Post.find().sort({
    updatedAt: -1
  }).limit(5).select('-content -html').lean()]));
  res.json({
    counts: {
      published,
      draft,
      archived,
      media
    },
    recent,
    admin: safeAdmin(req.admin)
  });
};
