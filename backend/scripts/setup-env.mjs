import { readFile, writeFile, access } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const backend = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(backend, '.env');
try {
  await access(target);
  console.log('backend/.env already exists and was left unchanged.');
  console.log('For the simplified variable list, see backend/.env.example and README.md.');
  process.exit(0);
} catch {}
let env = await readFile(path.join(backend, '.env.example'), 'utf8');
env = env.replace(/^SETUP_TOKEN=$/m, 'SETUP_TOKEN=' + randomBytes(32).toString('hex'));
await writeFile(target, env, { flag: 'wx', mode: 0o600 });
console.log('Created backend/.env with a private one-time SETUP_TOKEN.');
console.log('Set MONGODB_URI in that file. Then run npm run dev:all.');
console.log('Open http://localhost:5173/admin/setup and paste SETUP_TOKEN from backend/.env.');
console.log('After creating your account, blank SETUP_TOKEN and restart the backend.');
