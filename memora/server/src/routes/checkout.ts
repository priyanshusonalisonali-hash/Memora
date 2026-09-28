import { Router, Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { config } from '../config/index.js';
import { Draft } from '../models/Draft.js';
import { Order } from '../models/Order.js';
import { Surprise } from '../models/Surprise.js';
import { orderCreateSchema, verifyPaymentSchema } from '../validations/index.js';
import { getPaymentProvider } from '../services/payments/index.js';
import { logger } from '../utils/logger.js';
import { sanitizeText } from '../utils/sanitize.js';

const router = Router();
const paymentProvider = getPaymentProvider();

// 1. Create checkout order
router.post('/order', async (req: Request, res: Response) => {
  try {
    const parsed = orderCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { draftId, contact } = parsed.data;
    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    // Amount comes strictly from server configuration
    const amount = config.pricing.experiencePriceInr;
    const currency = config.pricing.currency;

    const receipt = `rcpt_${draft.id.slice(0, 8)}_${Date.now()}`;
    const orderResult = await paymentProvider.createOrder({
      amount,
      currency,
      receipt,
      notes: {
        draftId: draft.id,
        recipient: draft.recipientName,
        sender: draft.senderName,
      },
    });

    const orderId = nanoid(14);
    const order = new Order({
      _id: orderId,
      draftId: draft.id,
      provider: orderResult.provider,
      providerOrderId: orderResult.orderId,
      amount,
      currency,
      status: 'created',
      contact: contact ? sanitizeText(contact) : undefined,
    });

    await order.save();

    return res.json({
      orderId: orderResult.orderId, // Provider's order ID (e.g. order_xxx)
      internalOrderId: order.id,
      amount,
      currency,
      provider: orderResult.provider,
      keyId: orderResult.keyId,
      draftId: draft.id,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to create checkout order');
    return res.status(500).json({ error: 'Error generating checkout order' });
  }
});

// 2. Verify payment & publish surprise
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const parsed = verifyPaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { draftId, orderId, paymentId, signature, contact } = parsed.data;

    const isValid = paymentProvider.verifySignature({
      orderId,
      paymentId,
      signature,
    });

    if (!isValid) {
      logger.warn({ orderId, paymentId }, 'Invalid payment signature received');
      return res.status(400).json({ error: 'Payment signature verification failed' });
    }

    // Find the order
    let order = await Order.findOne({ providerOrderId: orderId });
    if (!order) {
      order = await Order.findById(orderId);
    }

    if (order) {
      order.status = 'paid';
      order.paymentId = paymentId;
      if (contact) order.contact = sanitizeText(contact);
      await order.save();
    }

    const draft = await Draft.findById(draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Associated draft not found' });
    }

    draft.status = 'paid';
    await draft.save();

    // Check if surprise already created (idempotency)
    let surprise = await Surprise.findOne({ orderId: order ? order.id : orderId });
    if (!surprise) {
      const slug = nanoid(12).toLowerCase(); // 12-char URL safe slug
      const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days

      surprise = new Surprise({
        slug,
        draftSnapshot: draft.toJSON(),
        orderId: order ? order.id : orderId,
        expiresAt,
        views: 0,
      });

      await surprise.save();
      logger.info({ slug, draftId }, 'Published new birthday surprise link');
    }

    return res.json({
      success: true,
      slug: surprise.slug,
      surpriseUrl: `/b/${surprise.slug}`,
      expiresAt: surprise.expiresAt,
    });
  } catch (error) {
    logger.error({ error }, 'Failed to verify payment');
    return res.status(500).json({ error: 'Payment verification failed' });
  }
});

// 3. Razorpay Webhook (idempotent asynchronous payment handler)
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = JSON.stringify(req.body);

    if (config.razorpay.webhookSecret) {
      const isValid = paymentProvider.verifyWebhook(rawBody, signature);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload?.payment?.entity;
      const orderId = paymentEntity?.order_id;
      const paymentId = paymentEntity?.id;

      if (orderId) {
        const order = await Order.findOne({ providerOrderId: orderId });
        if (order && order.status !== 'paid') {
          order.status = 'paid';
          order.paymentId = paymentId;
          await order.save();

          const draft = await Draft.findById(order.draftId);
          if (draft) {
            draft.status = 'paid';
            await draft.save();

            const existingSurprise = await Surprise.findOne({ orderId: order.id });
            if (!existingSurprise) {
              const slug = nanoid(12).toLowerCase();
              const expiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
              const surprise = new Surprise({
                slug,
                draftSnapshot: draft.toJSON(),
                orderId: order.id,
                expiresAt,
                views: 0,
              });
              await surprise.save();
            }
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error({ error }, 'Error processing webhook');
    return res.status(500).json({ error: 'Webhook processing error' });
  }
});

export default router;
