import { posts } from './siteData.js';
// Preserve the original seven guide URLs and text when importing them into the CMS.
export const legacyContent = '## Plan before you go\n\nChoose your timing, pickup location and preferred pace before confirming the experience. Dubai can feel very different between a cool morning, a sunset desert drive and a busy evening.\n\n## Keep the itinerary flexible\n\nLeave room for traffic, photo stops and the time you want to spend at each attraction. Private tours are especially useful when you want to adjust the route during the day.\n';
const html = '<h2>Plan before you go</h2><p>Choose your timing, pickup location and preferred pace before confirming the experience. Dubai can feel very different between a cool morning, a sunset desert drive and a busy evening.</p><h2>Keep the itinerary flexible</h2><p>Leave room for traffic, photo stops and the time you want to spend at each attraction. Private tours are especially useful when you want to adjust the route during the day.</p>';
export const legacyPosts = posts.map(p => ({
  ...p,
  content: legacyContent,
  html,
  imageAlt: p.title,
  author: 'Zuhd Tours Team',
  tags: [],
  seoTitle: p.title,
  seoDescription: p.excerpt
}));
