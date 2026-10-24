import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import { problem } from '../utils/security.js';
export function text(value, max = 200, required = false) {
  if (typeof value !== 'string') {
    if (required) throw problem('A required text field is missing.');
    return '';
  }
  const result = value.trim();
  if (result.length > max) throw problem(`Text is too long (maximum ${max} characters).`);
  if (required && !result) throw problem('Please complete the required fields.');
  return result;
}
export function safeImage(value) {
  const u = text(value, 1800);
  if (!u) return '';
  if (/^\/(?:images|assets|gallery|media)\/[A-Za-z0-9_.\/-]+$/.test(u) && !u.includes('..')) return u;
  try {
    const parsed = new URL(u);
    if (parsed.protocol === 'https:' && !parsed.username && !parsed.password) return u;
  } catch {}
  throw problem('Choose an uploaded image or a valid HTTPS image URL.');
}
export function markdownToHtml(markdown) {
  const parsed = marked.parse(markdown, {
    gfm: true,
    breaks: false
  });
  return sanitizeHtml(parsed, {
    allowedTags: ['p', 'br', 'strong', 'em', 's', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'hr', 'img', 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      th: ['scope']
    },
    allowedSchemes: ['https', 'http', 'mailto', 'tel'],
    allowProtocolRelative: false,
    transformTags: {
      a: (tag, attrs) => ({
        tagName: tag,
        attribs: {
          ...attrs,
          rel: 'noopener noreferrer',
          ...(attrs.href?.startsWith('http') ? {
            target: '_blank'
          } : {})
        }
      }),
      img: (tag, attrs) => ({
        tagName: tag,
        attribs: {
          ...attrs,
          loading: 'lazy'
        }
      })
    },
    exclusiveFilter: frame => frame.tag === 'img' && !(frame.attribs.src?.startsWith('https://') || /^\/(?:images|assets|gallery|media)\//.test(frame.attribs.src || ''))
  });
}
export function parsePost(input, old) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw problem('Invalid post.');
  const title = text(input.title, 180, true),
    slug = text(input.slug, 100, true);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw problem('URL slug must contain lowercase words separated by hyphens.');
  if ((old?.publishedAt || old?.seedKey) && old.slug !== slug) throw problem('The URL of a published guide stays fixed to protect existing links.');
  const status = input.status || 'draft';
  if (!['draft', 'published', 'archived'].includes(status)) throw problem('Choose a valid publishing status.');
  const content = text(input.content, 200000),
    excerpt = text(input.excerpt, 500);
  if (status === 'published' && (!content || !excerpt)) throw problem('Add article content and a summary before publishing.');
  const image = safeImage(input.image),
    imageAlt = text(input.imageAlt, 200);
  if (status === 'published' && image && !imageAlt) throw problem('Describe the cover image in the image alt text field.');
  const tags = Array.isArray(input.tags) ? input.tags.slice(0, 8).map(v => text(v, 40)).filter(Boolean) : [];
  return {
    title,
    slug,
    status,
    content,
    html: markdownToHtml(content),
    excerpt,
    category: text(input.category, 60) || 'Travel Tips',
    tags,
    image,
    imageAlt,
    author: text(input.author, 100) || 'Zuhd Tours Team',
    seoTitle: text(input.seoTitle, 100),
    seoDescription: text(input.seoDescription, 220),
    ...(status === 'published' && !old?.publishedAt ? {
      publishedAt: new Date()
    } : {})
  };
}
export function publicPost(p, full = false) {
  return {
    id: String(p._id),
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags || [],
    image: p.image,
    imageAlt: p.imageAlt,
    author: p.author,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    publishedAt: p.publishedAt,
    updatedAt: p.updatedAt,
    ...(full ? {
      html: p.html
    } : {})
  };
}
export const xmlEscape = value => String(value).replace(/[<>&"']/g, ch => ({
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&apos;'
})[ch]);
