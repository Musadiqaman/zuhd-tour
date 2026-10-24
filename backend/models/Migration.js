import mongoose from 'mongoose';
const {
  Schema
} = mongoose;
const migrationSchema = new Schema({
  _id: String,
  completedAt: Date
});
export const Migration = mongoose.models.Migration || mongoose.model('Migration', migrationSchema);
