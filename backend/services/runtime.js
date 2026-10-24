import mongoose from 'mongoose';
import { config, validateConfig } from '../config/env.js';
import { connectDatabase } from '../config/db.js';
import { seedExistingGuides } from './seed.js';

let initialization;
let ready = false;

export function initializeRuntime() {
  if (ready && mongoose.connection.readyState === 1) return Promise.resolve();
  if (initialization) return initialization;

  ready = false;
  initialization = (async () => {
    validateConfig();
    await connectDatabase(config.mongo);
    await seedExistingGuides();
    ready = true;
  })().finally(() => {
    // A transient database failure must not poison every later invocation.
    initialization = undefined;
  });
  return initialization;
}
