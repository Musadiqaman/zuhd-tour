import { Admin, Session } from '../models/index.js';
import { config } from '../config/env.js';
import { equal, hashPassword, checkPassword, createSession, clearSessionCookie, safeAdmin, validatePassword, validateEmail, problem } from '../utils/security.js';
import { text } from '../utils/content.js';
export const authStatus = async (req, res) => res.json({
  initialized: Boolean(await Admin.exists({})),
  setupEnabled: config.setupToken.length >= 32
});
export const setupAdmin = async (req, res) => {
  if (await Admin.exists({})) throw problem('The administrator is already configured.', 409);
  if (config.setupToken.length < 32 || !equal(req.body?.setupToken, config.setupToken)) throw problem('The setup code is incorrect.', 403);
  const name = text(req.body.name, 80, true),
    email = validateEmail(req.body.email),
    password = validatePassword(req.body.password);
  const owner = await Admin.create({
    singleton: 'owner',
    name,
    email,
    passwordHash: await hashPassword(password)
  });
  const csrfToken = await createSession(owner, res);
  res.status(201).json({
    admin: safeAdmin(owner),
    csrfToken
  });
};
export const login = async (req, res) => {
  const email = validateEmail(req.body?.email),
    password = String(req.body?.password || '').slice(0, 129);
  const owner = await Admin.findOne({
    email
  }).select('+passwordHash');
  if (owner?.lockedUntil && owner.lockedUntil > Date.now()) throw problem('Sign-in is temporarily locked. Try again in 15 minutes.', 429);
  if (!owner || !(await checkPassword(password, owner.passwordHash))) {
    if (owner) {
      const attempts = owner.failedLogins + 1;
      await Admin.updateOne({
        _id: owner._id
      }, {
        $set: {
          failedLogins: attempts,
          ...(attempts >= 10 ? {
            lockedUntil: new Date(Date.now() + 15 * 60 * 1000)
          } : {})
        }
      });
    }
    throw problem('The email or password is incorrect.', 401);
  }
  await Admin.updateOne({
    _id: owner._id
  }, {
    $set: {
      failedLogins: 0
    },
    $unset: {
      lockedUntil: 1
    }
  });
  const csrfToken = await createSession(owner, res);
  res.json({
    admin: safeAdmin(owner),
    csrfToken
  });
};
export const me = (req, res) => res.json({
  admin: safeAdmin(req.admin),
  csrfToken: req.session.csrfToken
});
export const logout = async (req, res) => {
  await Session.deleteOne({
    _id: req.session._id
  });
  clearSessionCookie(res);
  res.json({
    ok: true
  });
};
export const changePassword = async (req, res) => {
  const old = await Admin.findById(req.admin._id).select('+passwordHash');
  if (!(await checkPassword(String(req.body?.currentPassword || ''), old.passwordHash))) throw problem('Your current password is incorrect.', 400);
  const next = validatePassword(req.body.newPassword);
  if (await checkPassword(next, old.passwordHash)) throw problem('Choose a different password.');
  await Admin.updateOne({
    _id: old._id
  }, {
    $set: {
      passwordHash: await hashPassword(next),
      failedLogins: 0
    },
    $unset: {
      lockedUntil: 1
    }
  });
  await Session.deleteMany({
    adminId: old._id
  });
  const csrfToken = await createSession(old, res);
  res.json({
    ok: true,
    csrfToken,
    message: 'Password updated. Other sessions have been signed out.'
  });
};
