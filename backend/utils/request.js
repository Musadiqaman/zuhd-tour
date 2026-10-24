import mongoose from 'mongoose';
import { problem } from './security.js';
export const id = value => {
  if (!mongoose.isValidObjectId(value)) throw problem('Item not found.', 404);
  return value;
};
export const paging = (query, max = 30) => ({
  page: Math.max(1, Math.min(10000, Number.parseInt(query.page) || 1)),
  limit: Math.max(1, Math.min(max, Number.parseInt(query.limit) || 12))
});
