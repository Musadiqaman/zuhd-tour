import { Post } from '../models/index.js';
import { problem } from '../utils/security.js';
import { parsePost } from '../utils/content.js';
import { id, paging } from '../utils/request.js';
export const listPosts = async (req, res) => {
  const {
      page,
      limit
    } = paging(req.query),
    filter = {};
  if (['draft', 'published', 'archived'].includes(req.query.status)) filter.status = req.query.status;
  const q = String(req.query.q || '').trim().slice(0, 100);
  if (q) filter.title = {
    $regex: q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    $options: 'i'
  };
  const [items, total] = await Promise.all([Post.find(filter).sort({
    updatedAt: -1,
    _id: -1
  }).skip((page - 1) * limit).limit(limit).select('-content -html').lean(), Post.countDocuments(filter)]);
  res.json({
    items,
    total,
    page,
    pages: Math.max(1, Math.ceil(total / limit))
  });
};
export const getPost = async (req, res) => {
  const post = await Post.findById(id(req.params.id)).lean();
  if (!post) throw problem('Guide not found.', 404);
  res.json({
    post
  });
};
export const createPost = async (req, res) => {
  const values = parsePost(req.body);
  const post = await Post.create(values);
  res.status(201).json({
    post
  });
};
export const updatePost = async (req, res) => {
  const old = await Post.findById(id(req.params.id)).lean();
  if (!old) throw problem('Guide not found.', 404);
  if (req.body.version !== old.version) throw problem('This guide was updated in another window. Reload it before saving.', 409);
  const values = parsePost(req.body, old);
  const post = await Post.findOneAndUpdate({
    _id: old._id,
    version: old.version
  }, {
    $set: values,
    $inc: {
      version: 1
    }
  }, {
    new: true,
    runValidators: true
  }).lean();
  if (!post) throw problem('The guide changed. Reload before saving.', 409);
  res.json({
    post
  });
};
export const changePostStatus = async (req, res) => {
  const old = await Post.findById(id(req.params.id)).lean();
  if (!old) throw problem('Guide not found.', 404);
  if (req.body.version !== old.version) throw problem('The guide changed. Refresh the list.', 409);
  const values = parsePost({
    ...old,
    status: req.body.status
  }, old);
  const post = await Post.findOneAndUpdate({
    _id: old._id,
    version: old.version
  }, {
    $set: values,
    $inc: {
      version: 1
    }
  }, {
    new: true
  }).select('-content -html').lean();
  if (!post) throw problem('The guide changed. Refresh the list.', 409);
  res.json({
    post
  });
};
export const deletePost = async (req, res) => {
  const post = await Post.findById(id(req.params.id));
  if (!post) throw problem('Guide not found.', 404);
  if (post.status === 'published') throw problem('Unpublish or archive this guide before deleting it.', 409);
  if (req.body?.version !== post.version) throw problem('The guide changed. Refresh the list.', 409);
  await Post.deleteOne({
    _id: post._id,
    version: post.version
  });
  res.json({
    ok: true
  });
};
