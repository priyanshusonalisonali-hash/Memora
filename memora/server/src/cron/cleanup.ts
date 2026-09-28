import cron from 'node-cron';
import { Surprise } from '../models/Surprise.js';
import { getStorageProvider } from '../services/storage/index.js';
import { logger } from '../utils/logger.js';

export function initCleanupCron() {
  const storage = getStorageProvider();

  // Run every day at 03:00 AM server time
  cron.schedule('0 3 * * *', async () => {
    logger.info('Starting daily cleanup of expired surprises and media...');
    try {
      const now = new Date();
      const expiredSurprises = await Surprise.find({ expiresAt: { $lt: now } });

      logger.info(`Found ${expiredSurprises.length} expired surprises to purge`);

      for (const surprise of expiredSurprises) {
        const photos = surprise.draftSnapshot?.photos || [];
        for (const photo of photos) {
          if (photo.url) {
            await storage.deleteFile(photo.url);
          }
        }
        await Surprise.deleteOne({ _id: surprise._id });
        logger.info(`Purged expired surprise: ${surprise.slug}`);
      }

      logger.info('Daily cleanup job completed successfully');
    } catch (error) {
      logger.error({ error }, 'Error during daily cleanup cron');
    }
  });

  logger.info('Daily cleanup cron job scheduled (03:00 AM)');
}
