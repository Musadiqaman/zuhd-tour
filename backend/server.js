import { config, validateConfig } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { seedExistingGuides } from './services/seed.js';
import { createApp } from './app.js';
import mongoose from 'mongoose';
try {
  validateConfig();
  await connectDatabase(config.mongo);
  await seedExistingGuides();
  const server = createApp().listen(config.port, config.host, () => console.log(`Zuhd Tours is ready on http://${config.host}:${config.port}`));
  const shutdown = () => server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} catch (err) {
  console.error('Startup failed:', err.message);
  process.exit(1);
}
