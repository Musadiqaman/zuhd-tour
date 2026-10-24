import express from 'express';
import { publicPosts, publicPostBySlug, publicReviews, publicSite } from '../controllers/publicController.js';
import { reviewLimiter } from '../middlewares/rateLimit.js';
const router = express.Router();
router.get('/site', publicSite);
router.get('/posts', publicPosts);
router.get('/posts/:slug', publicPostBySlug);
router.get('/reviews', reviewLimiter, publicReviews);
export default router;
