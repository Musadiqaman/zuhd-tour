import express from 'express';
import mongoose from 'mongoose';
import auth from './authRoutes.js';
import admin from './adminRoutes.js';
import pub from './publicRoutes.js';
const router = express.Router();
router.get('/health', (req, res) => res.json({
  ok: true,
  database: mongoose.connection.readyState === 1
}));
router.use('/auth', auth);
router.use('/admin', admin);
router.use('/public', pub);
router.use((req, res) => res.status(404).json({
  error: 'API endpoint not found.'
}));
export default router;
