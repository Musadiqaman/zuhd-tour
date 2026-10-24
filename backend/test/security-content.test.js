import test from 'node:test';
import assert from 'node:assert/strict';
const {
  hashPassword,
  checkPassword,
  validatePassword
} = await import('../utils/security.js');
const {
  markdownToHtml,
  parsePost,
  safeImage
} = await import('../utils/content.js');
test('passwords use unique salts and reject a different password', async () => {
  const password = 'A unique testing passphrase 42';
  const first = await hashPassword(password),
    second = await hashPassword(password);
  assert.notEqual(first, second);
  assert(!first.includes(password));
  assert(await checkPassword(password, first));
  assert.equal(await checkPassword('wrong', first), false);
  assert.throws(() => validatePassword('short'));
  assert.throws(() => validatePassword('x'.repeat(129)));
});
test('article HTML removes executable content while preserving useful formatting', () => {
  const html = markdownToHtml('## A real heading\n\n[Tour](/tours/morning-desert-safari)\n\n<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)"><iframe src="https://example.com"></iframe>\n\n![Dunes](/media/123.webp)');
  assert(html.includes('<h2>A real heading</h2>'));
  assert(html.includes('href="/tours/morning-desert-safari"'));
  assert(html.includes('src="/media/123.webp"'));
  assert(!/script|onerror|iframe|javascript:/i.test(html));
});
test('publishing requires useful content, image descriptions and stable URLs', () => {
  const p = {
    title: 'Morning safari guide',
    slug: 'morning-guide',
    status: 'published',
    excerpt: 'Plan your morning.',
    content: '## Before you travel\nRead these practical tips.',
    image: '/images/safaris/morning-main.webp',
    imageAlt: 'A vehicle on golden dunes'
  };
  assert.equal(parsePost(p).status, 'published');
  assert.throws(() => parsePost({
    ...p,
    excerpt: ''
  }));
  assert.throws(() => parsePost({
    ...p,
    imageAlt: ''
  }));
  assert.throws(() => parsePost({
    ...p,
    slug: 'new-url'
  }, {
    slug: p.slug,
    publishedAt: new Date()
  }));
  assert.throws(() => safeImage('javascript:alert(1)'));
  assert.throws(() => safeImage('/images/../private.jpg'));
});
