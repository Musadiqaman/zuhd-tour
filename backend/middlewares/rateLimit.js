import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
export const limited = (limit, windowMs = 15 * 60 * 1000) => rateLimit({
  windowMs,
  limit,
  keyGenerator: req => ipKeyGenerator(req.zuhdClientIp || req.ip),
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    error: 'Too many attempts. Please wait before trying again.'
  }
});
export const loginLimiter = limited(10),
  writeLimiter = limited(200),
  reviewLimiter = limited(30, 60 * 60 * 1000);
export const cookieNoStore = (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
};
