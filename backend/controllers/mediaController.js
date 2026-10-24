import { Media, Post } from '../models/index.js';
import { problem, sha } from '../utils/security.js';
import { text } from '../utils/content.js';
import { id, paging } from '../utils/request.js';
import { optimizeImage, imagePolicy } from '../services/imageOptimization.js';
const imageDto = (m, reused = false) => ({
  id: String(m._id),
  url: '/media/' + m._id + '.webp',
  name: m.name,
  width: m.width,
  height: m.height,
  alt: m.alt,
  size: m.size,
  originalSize: m.originalSize || m.size,
  reused
});
export async function uploadImage(req, res) {
  if (!req.file) throw problem('Choose a JPG, PNG or WebP image (maximum 4 MB).');
  const sourceHash = sha(req.file.buffer),
    existing = await Media.findOne({
      sourceHash
    }).lean();
  if (existing) return res.json({
    image: imageDto(existing, true)
  });
  const optimized = await optimizeImage(req.file.buffer),
    same = await Media.findOne({
      hash: optimized.hash
    }).lean();
  if (same) return res.json({
    image: imageDto(same, true)
  });
  try {
    const image = await Media.create({
      ...optimized,
      name: text(req.file.originalname, 180) || 'Image',
      alt: text(req.body.alt, 200)
    });
    return res.status(201).json({
      image: imageDto(image)
    });
  } catch (error) {
    if (error.code === 11000) {
      const image = await Media.findOne({
        sourceHash
      }).lean();
      if (image) return res.json({
        image: imageDto(image, true)
      });
    }
    throw error;
  }
}
export async function listImages(req, res) {
  const {
    page,
    limit
  } = paging(req.query, 24);
  const [items, total, stats] = await Promise.all([Media.find().sort({
    createdAt: -1,
    _id: -1
  }).skip((page - 1) * limit).limit(limit).select('-hash -sourceHash').lean(), Media.countDocuments({}), Media.aggregate([{
    $group: {
      _id: null,
      bytes: {
        $sum: '$size'
      },
      originalBytes: {
        $sum: {
          $ifNull: ['$originalSize', '$size']
        }
      }
    }
  }])]);
  res.json({
    items: items.map(m => ({
      ...m,
      url: '/media/' + m._id + '.webp'
    })),
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit)),
    storage: {
      bytes: stats[0]?.bytes || 0,
      originalBytes: stats[0]?.originalBytes || 0,
      count: total
    },
    policy: imagePolicy
  });
}
export async function deleteImage(req, res) {
  const mid = id(req.params.id),
    url = '/media/' + mid + '.webp';
  if (await Post.exists({
    $or: [{
      image: url
    }, {
      content: {
        $regex: mid
      }
    }]
  })) throw problem('This image is used in a guide. Remove it from that guide first.', 409);
  await Media.deleteOne({
    _id: mid
  });
  res.json({
    ok: true
  });
}
