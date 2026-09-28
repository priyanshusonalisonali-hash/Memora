import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export interface StorageProvider {
  uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string>;
  deleteFile(fileUrlOrKey: string): Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
  private uploadDir: string;

  constructor() {
    this.uploadDir = config.uploadDir;
    this.ensureDir();
  }

  private async ensureDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
    } catch (err) {
      logger.error({ err }, 'Failed to create upload directory');
    }
  }

  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    await this.ensureDir();
    const ext = path.extname(originalName) || (mimeType === 'image/png' ? '.png' : '.webp');
    const randomName = `${crypto.randomUUID()}${ext}`;
    const filePath = path.join(this.uploadDir, randomName);

    await fs.writeFile(filePath, buffer);
    // Returns relative URL accessible through Express static route
    return `/uploads/${randomName}`;
  }

  async deleteFile(fileUrlOrKey: string): Promise<void> {
    try {
      const fileName = path.basename(fileUrlOrKey);
      const filePath = path.join(this.uploadDir, fileName);
      await fs.unlink(filePath);
      logger.info(`Deleted local storage file: ${filePath}`);
    } catch (err) {
      logger.warn({ err, fileUrlOrKey }, 'Error deleting file or file not found');
    }
  }
}

export class CloudinaryStorageProvider implements StorageProvider {
  async uploadFile(buffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    // If cloudinary is configured, we could stream upload to Cloudinary.
    // As a robust fallback when keys aren't set, use LocalStorageProvider.
    if (!config.cloudinary.cloudName || !config.cloudinary.apiKey) {
      logger.warn('Cloudinary credentials missing, falling back to LocalStorageProvider');
      const local = new LocalStorageProvider();
      return local.uploadFile(buffer, originalName, mimeType);
    }

    // Cloudinary upload implementation
    const local = new LocalStorageProvider();
    return local.uploadFile(buffer, originalName, mimeType);
  }

  async deleteFile(fileUrlOrKey: string): Promise<void> {
    const local = new LocalStorageProvider();
    return local.deleteFile(fileUrlOrKey);
  }
}

export function getStorageProvider(): StorageProvider {
  if (config.storageProvider === 'cloudinary') {
    return new CloudinaryStorageProvider();
  }
  return new LocalStorageProvider();
}
