import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

let mongod: MongoMemoryServer | null = null;

export async function connectDB(): Promise<void> {
  try {
    let uri = config.mongoUri;

    if (!uri) {
      logger.info('No MONGODB_URI provided. Initializing in-memory MongoDB server for development...');
      mongod = await MongoMemoryServer.create();
      uri = mongod.getUri();
      logger.info(`In-memory MongoDB started at: ${uri}`);
    }

    await mongoose.connect(uri);
    logger.info('Successfully connected to MongoDB');
  } catch (error) {
    logger.error({ error }, 'Failed to connect to primary MongoDB, attempting in-memory fallback...');
    try {
      if (!mongod) {
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        await mongoose.connect(fallbackUri);
        logger.info(`Fallback in-memory MongoDB connected at: ${fallbackUri}`);
      }
    } catch (fallbackError) {
      logger.error({ error: fallbackError }, 'Failed to start in-memory MongoDB fallback');
      throw fallbackError;
    }
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
}
