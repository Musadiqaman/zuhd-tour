import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const adminSchema = new Schema({
  singleton: {
    type: String,
    default: 'owner',
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  failedLogins: {
    type: Number,
    default: 0
  },
  lockedUntil: Date
}, {
  timestamps: true
});
export const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
