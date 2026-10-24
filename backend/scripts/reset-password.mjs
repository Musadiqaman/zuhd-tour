import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import mongoose from 'mongoose';
import { config, validateConfig } from '../config/env.js';
import { Admin, Session } from '../models/index.js';
import { connectDatabase } from '../config/db.js';
import { hashPassword, validatePassword } from '../utils/security.js';
if (process.argv.includes('--help')) {
  console.log('Run npm run reset-password from the trusted backend terminal. You will be asked for the administrator email and a new password. All existing sessions are revoked.');
  process.exit(0);
}
validateConfig();
await connectDatabase(config.mongo);
const rl = createInterface({
  input: stdin,
  output: stdout
});
try {
  const email = (await rl.question('Administrator email: ')).trim().toLowerCase();
  const admin = await Admin.findOne({
    email
  });
  if (!admin) throw Error('Administrator not found.');
  console.log('The password you type is visible in this local terminal.');
  const password = validatePassword(await rl.question('New password (12+ characters): '));
  if (password !== (await rl.question('Confirm password: '))) throw Error('Passwords do not match.');
  await Admin.updateOne({
    _id: admin._id
  }, {
    $set: {
      passwordHash: await hashPassword(password),
      failedLogins: 0
    },
    $unset: {
      lockedUntil: 1
    }
  });
  await Session.deleteMany({
    adminId: admin._id
  });
  console.log('Password changed. All sessions signed out.');
} catch (e) {
  console.error(e.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await mongoose.disconnect();
}
