import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const sessionSchema = new Schema({
  tokenHash: {
    type: String,
    unique: true,
    required: true
  },
  adminId: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
    index: true
  },
  csrfToken: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});
sessionSchema.index({
  expiresAt: 1
}, {
  expireAfterSeconds: 0
});
export const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);
