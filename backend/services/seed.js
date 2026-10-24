import { Post, Migration } from '../models/index.js';
import { markdownToHtml } from '../utils/content.js';
import { legacyPosts } from '../../frontend/src/data/legacyBlogContent.js';
export async function seedExistingGuides() {
  const key = 'existing-guides-v1';
  if (await Migration.exists({
    _id: key
  })) return;
  for (const p of legacyPosts) {
    await Post.updateOne({
      slug: p.slug
    }, {
      $setOnInsert: {
        ...p,
        seedKey: p.slug,
        html: markdownToHtml(p.content),
        status: 'published',
        publishedAt: null,
        version: 1
      }
    }, {
      upsert: true
    });
  }
  await Migration.updateOne({
    _id: key
  }, {
    $set: {
      completedAt: new Date()
    }
  }, {
    upsert: true
  });
}
