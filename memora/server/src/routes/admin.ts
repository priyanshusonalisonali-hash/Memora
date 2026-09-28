import { Router, Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';
import { Order } from '../models/Order.js';
import { Draft } from '../models/Draft.js';
import { Surprise } from '../models/Surprise.js';
import { Event } from '../models/Event.js';
import { logger } from '../utils/logger.js';

const router = Router();

// Middleware: Authenticate Admin Token
function adminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : req.headers['x-admin-token'];
  const queryToken = req.query.token as string | undefined;

  const providedToken = headerToken || queryToken;

  if (!providedToken || providedToken !== config.adminToken) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing admin token' });
  }

  return next();
}

router.use(adminAuth);

// GET /api/admin/stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const totalDrafts = await Draft.countDocuments();
    const paidOrders = await Order.find({ status: 'paid' });
    const totalRevenuePaise = paidOrders.reduce((acc, curr) => acc + curr.amount, 0);
    const totalPublishedSurprises = await Surprise.countDocuments();
    const totalViews = await Surprise.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);

    // Funnel counts
    const funnelSteps = [
      'page_view',
      'wizard_step_completed',
      'preview_completed',
      'paywall_viewed',
      'checkout_started',
      'payment_success',
    ];

    const funnelCounts: Record<string, number> = {};
    for (const step of funnelSteps) {
      funnelCounts[step] = await Event.countDocuments({ name: step });
    }

    return res.json({
      totalDrafts,
      totalPaidOrders: paidOrders.length,
      totalRevenueInr: totalRevenuePaise / 100,
      totalPublishedSurprises,
      totalViews: totalViews[0]?.totalViews || 0,
      funnel: funnelCounts,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch admin stats');
    return res.status(500).json({ error: 'Internal server error fetching stats' });
  }
});

// GET /api/admin/orders
router.get('/orders', async (_req: Request, res: Response) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100);
    return res.json(orders);
  } catch (error) {
    logger.error({ error }, 'Failed to fetch admin orders');
    return res.status(500).json({ error: 'Internal server error fetching orders' });
  }
});

export default router;
