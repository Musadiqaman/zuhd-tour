import { Admin, Session } from '../models/index.js';
import { config } from '../config/env.js';
import { cookieName, sha, equal, clearSessionCookie } from '../utils/security.js';
export async function requireAuth(req, res, next) {
  const raw = req.cookies[cookieName];
  if (!raw || !/^\w{64}$/.test(raw)) return res.status(401).json({
    error: 'Please sign in to continue.'
  });
  const session = await Session.findOne({
    tokenHash: sha(raw),
    expiresAt: {
      $gt: new Date()
    }
  });
  if (!session) {
    clearSessionCookie(res);
    return res.status(401).json({
      error: 'Your session expired. Please sign in again.'
    });
  }
  const admin = await Admin.findById(session.adminId);
  if (!admin) return res.status(401).json({
    error: 'Please sign in again.'
  });
  req.admin = admin;
  req.session = session;
  next();
}
export function csrf(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (!equal(req.get('x-csrf-token'), req.session?.csrfToken)) return res.status(403).json({
    error: 'Security check expired. Refresh the page and try again.'
  });
  next();
}
export function originGuard(req, res, next) {
  if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    const origin = req.get('origin');
    if (origin && !config.origins.has(origin)) return res.status(403).json({
      error: 'This origin is not allowed.'
    });
    if (req.get('sec-fetch-site') === 'cross-site' && !origin) return res.status(403).json({
      error: 'Cross-site request rejected.'
    });
  }
  next();
}
