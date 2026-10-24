import sharp from 'sharp';
import { problem, sha } from '../utils/security.js';
export const imagePolicy = {
  targetBytes: 220 * 1024,
  maxBytes: 450 * 1024,
  maxUploadBytes: 4 * 1024 * 1024
};
export async function optimizeImage(buffer) {
  if (!Buffer.isBuffer(buffer) || !buffer.length || buffer.length > imagePolicy.maxUploadBytes) throw problem('Choose a JPG, PNG or WebP smaller than 4 MB.');
  try {
    const metadata = await sharp(buffer, {
      limitInputPixels: 40000000
    }).metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format) || metadata.pages > 1) throw Error('Unsupported image');
    let result;
    for (const [width, quality] of [[1440, 82], [1440, 78], [1280, 78], [1120, 78], [1120, 74], [960, 74]]) {
      result = await sharp(buffer, {
        limitInputPixels: 40000000,
        animated: false
      }).rotate().resize({
        width,
        height: width,
        fit: 'inside',
        withoutEnlargement: true
      }).webp({
        quality,
        effort: 5
      }).toBuffer({
        resolveWithObject: true
      });
      if (result.data.length <= imagePolicy.targetBytes) break;
    }
    if (result.data.length > imagePolicy.maxBytes) throw problem('This photo is too detailed to fit the image budget. Try a smaller image.');
    return {
      data: result.data,
      width: result.info.width,
      height: result.info.height,
      size: result.data.length,
      originalSize: buffer.length,
      sourceHash: sha(buffer),
      hash: sha(result.data)
    };
  } catch (error) {
    if (error.expose) throw error;
    throw problem('Upload a readable, non-animated JPG, PNG or WebP image.');
  }
}
