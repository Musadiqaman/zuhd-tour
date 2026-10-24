import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const mediaSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  mime: {
    type: String,
    default: 'image/webp'
  },
  width: Number,
  height: Number,
  size: Number,
  originalSize: Number,
  sourceHash: String,
  hash: String,
  data: {
    type: Buffer,
    select: false
  }
}, {
  timestamps: true
});
mediaSchema.index({
  createdAt: -1,
  _id: -1
});
mediaSchema.index({
  sourceHash: 1
}, {
  unique: true,
  sparse: true
});
mediaSchema.index({
  hash: 1
});
export const Media = mongoose.models.Media || mongoose.model('Media', mediaSchema);
