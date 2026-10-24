import mongoose from 'mongoose';
import { Admin, Session, Post, Media, Settings, Migration } from '../models/index.js';
export async function connectDatabase(uri) {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000
  });
  await Promise.all([Admin, Session, Post, Media, Settings, Migration].map(model => model.createIndexes()));
}
