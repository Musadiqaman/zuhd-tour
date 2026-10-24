import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const postSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  html: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'Travel Tips'
  },
  tags: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ''
  },
  imageAlt: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: 'Zuhd Tours Team'
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoDescription: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  version: {
    type: Number,
    default: 1
  },
  seedKey: String
}, {
  timestamps: true
});
postSchema.index({
  status: 1,
  publishedAt: -1,
  _id: -1
});
postSchema.index({
  status: 1,
  updatedAt: -1,
  _id: -1
});
postSchema.index({
  status: 1,
  category: 1,
  publishedAt: -1
});
postSchema.index({
  title: 'text',
  excerpt: 'text',
  tags: 'text'
});
postSchema.index({
  seedKey: 1
}, {
  unique: true,
  sparse: true
});
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
