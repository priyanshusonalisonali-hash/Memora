import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { config } from './config/index.js';
import draftsRouter from './routes/drafts.js';
import previewRouter from './routes/preview.js';
import checkoutRouter from './routes/checkout.js';
import surprisesRouter from './routes/surprises.js';
import eventsRouter from './routes/events.js';
import adminRouter from './routes/admin.js';
import { OCCASIONS } from './occasions/index.js';
import { logger } from './utils/logger.js';

export function createApp() {
  const app = express();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Vite and local dev flexibility
    })
  );

  // CORS Configuration
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token'],
    })
  );

  // Body parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Serve static uploaded photos
  app.use('/uploads', express.static(config.uploadDir));

  // Rate limiters
  const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });

  const creationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 50,
    message: { error: 'Draft creation rate limit reached, please try again later.' },
  });

  const checkoutLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 30,
    message: { error: 'Checkout rate limit reached, please try again later.' },
  });

  app.use('/api', globalLimiter);
  app.use('/api/drafts', creationLimiter, draftsRouter);
  app.use('/api/preview', previewRouter);
  app.use('/api/checkout', checkoutLimiter, checkoutRouter);
  app.use('/api/public/surprises', surprisesRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/admin', adminRouter);

  // Occasions config endpoint
  app.get('/api/occasions', (_req: Request, res: Response) => {
    return res.json(OCCASIONS);
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    return res.json({
      status: 'ok',
      service: 'LumiWish Backend',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    return res.status(404).json({ error: 'Endpoint not found' });
  });

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, 'Unhandled request error');
    return res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}
