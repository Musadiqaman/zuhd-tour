import { scrypt as scryptCb, randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { Session } from '../models/index.js';
import { config } from '../config/env.js';
const scrypt = promisify(scryptCb);
export const cookieName = config.production ? '__Host-zuhd_session' : 'zuhd_session';
export const token = () => randomBytes(32).toString('hex');
export const sha = value => createHash('sha256').update(value).digest('hex');
export function equal(a, b) {
  const x = Buffer.from(String(a || '')),
    y = Buffer.from(String(b || ''));
  return x.length === y.length && timingSafeEqual(x, y);
}
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const key = await scrypt(password, salt, 64, {
    N: 16384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024
  });
  return `scrypt$${salt}$${key.toString('hex')}`;
}
export async function checkPassword(password, hash) {
  try {
    const [type, salt, key] = hash.split('$');
    if (type !== 'scrypt') return false;
    const derived = await scrypt(password, salt, 64, {
      N: 16384,
      r: 8,
      p: 1,
      maxmem: 64 * 1024 * 1024
    });
    return equal(derived.toString('hex'), key);
  } catch {
    return false;
  }
}
const cookieOptions = {
  httpOnly: true,
  secure: config.production,
  sameSite: 'lax',
  path: '/'
};
export function clearSessionCookie(res) {
  res.clearCookie(cookieName, cookieOptions);
}
export async function createSession(admin, res) {
  const value = token(),
    csrfToken = token();
  await Session.create({
    tokenHash: sha(value),
    adminId: admin._id,
    csrfToken,
    expiresAt: new Date(Date.now() + config.sessionMs)
  });
  res.cookie(cookieName, value, {
    ...cookieOptions,
    maxAge: config.sessionMs
  });
  return csrfToken;
}
export function safeAdmin(a) {
  return {
    id: String(a._id),
    name: a.name,
    email: a.email
  };
}
export function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 12 || value.length > 128) throw Object.assign(Error('Use a password with 12–128 characters.'), {
    status: 400
  });
  return value;
}
export function validateEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || !/^\S+@\S+\.\S+$/.test(value)) throw Object.assign(Error('Enter a valid email address.'), {
    status: 400
  });
  return value.toLowerCase().trim();
}
export function problem(message, status = 400) {
  return Object.assign(Error(message), {
    status,
    expose: true
  });
}
