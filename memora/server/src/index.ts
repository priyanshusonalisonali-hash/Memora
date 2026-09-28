import { createApp } from './app.js';
import { connectDB } from './db/connection.js';
import { initCleanupCron } from './cron/cleanup.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
  try {
    await connectDB();
    initCleanupCron();

    const app = createApp();
    app.listen(config.port, () => {
      logger.info(`✨ LumiWish Server running on http://localhost:${config.port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Fatal error during server startup');
    process.exit(1);
  }
}

bootstrap();
