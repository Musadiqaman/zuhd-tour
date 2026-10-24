export function readingMinutes(post) {
  const words = String(post.html || post.content || post.excerpt || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function articleOutline(html = '') {
  const headings = [];
  const entities = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  const content = String(html).replace(/<h([23])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, level, inner) => {
    const id = `guide-section-${headings.length + 1}`;
    const title = inner.replace(/<[^>]*>/g, '').replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, key) => entities[key]);
    headings.push({ id, title, level: Number(level) });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  return { content, headings };
}

export function journalDate(value) {
  if (!value || Number.isNaN(new Date(value).getTime())) return '';
  return new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
