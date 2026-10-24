import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import sharp from 'sharp';
import { optimizeImage, imagePolicy } from '../services/imageOptimization.js';
import { validateSocialLinks } from '../utils/socialLinks.js';
test('detailed uploads fit the media budget and metadata is stripped', async () => {
  const input = await sharp(randomBytes(1800 * 1200 * 3), {
    raw: {
      width: 1800,
      height: 1200,
      channels: 3
    }
  }).jpeg({
    quality: 90
  }).withMetadata().toBuffer();
  const result = await optimizeImage(input),
    metadata = await sharp(result.data).metadata();
  assert(result.size <= imagePolicy.maxBytes);
  assert(result.size < input.length);
  assert.equal(result.originalSize, input.length);
  assert.equal(metadata.format, 'webp');
  assert(metadata.width <= 1440);
  assert.equal(metadata.exif, undefined);
  assert.equal(metadata.icc, undefined);
  assert.equal(result.sourceHash.length, 64);
});
test('invalid image content is rejected before storage', async () => {
  await assert.rejects(() => optimizeImage(Buffer.from('<svg><script>alert(1)</script></svg>')), /readable/);
  await assert.rejects(() => optimizeImage(Buffer.alloc(imagePolicy.maxUploadBytes + 1)), /smaller than 4 MB/);
});
test('social URLs accept profiles and reject unsafe or misleading hosts', () => {
  assert.equal(validateSocialLinks({
    instagram: 'https://www.instagram.com/zuhdtours/'
  }).instagram, 'https://www.instagram.com/zuhdtours/');
  assert.equal(validateSocialLinks({}).facebook, '');
  for (const value of ['javascript:alert(1)', 'https://instagram.com.evil.test/zuhd', 'https://user:pass@instagram.com/zuhd', 'https://instagram.com/', 'http://instagram.com/zuhd']) assert.throws(() => validateSocialLinks({
    instagram: value
  }));
});
