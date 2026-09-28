import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || '',
  storageProvider: (process.env.STORAGE_PROVIDER || 'local') as 'local' | 'cloudinary',
  uploadDir: path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads'),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  },
  pricing: {
    experiencePriceInr: parseInt(process.env.EXPERIENCE_PRICE_INR || '19900', 10), // ₹199 in paise
    originalPriceInr: parseInt(process.env.ORIGINAL_PRICE_INR || '49900', 10), // ₹499 in paise
    currency: 'INR',
  },
  adminToken: process.env.ADMIN_TOKEN || 'lumiwish_super_secret_admin_token_2026',
};
