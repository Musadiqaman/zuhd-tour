import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const settingsSchema = new Schema({
  _id: {
    type: String,
    default: 'site'
  },
  googleMapsUrl: {
    type: String,
    default: 'https://maps.app.goo.gl/xFMfxpXM7EULLtuJ6'
  },
  reviewsEnabled: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    type: Map,
    of: String,
    default: () => ({})
  },
  defaultAuthor: {
    type: String,
    default: 'Zuhd Tours Team'
  }
}, {
  timestamps: true
});
export const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
