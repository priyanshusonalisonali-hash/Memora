import { z } from 'zod';

export const photoSchema = z.object({
  id: z.string(),
  url: z.string(),
  caption: z.string().max(100).optional().default(''),
  order: z.number().int().min(0),
});

export const draftSchema = z.object({
  occasion: z.string().default('birthday'),
  recipientName: z.string().max(100).default(''),
  senderName: z.string().max(100).default(''),
  age: z.number().int().min(1).max(120).optional().nullable(),
  birthdayDay: z.number().int().min(1).max(31).optional().nullable(),
  birthdayMonth: z.number().int().min(1).max(12).optional().nullable(),
  cakeId: z.enum(['midnight_chocolate', 'strawberry_blush', 'vanilla_gold']).default('midnight_chocolate'),
  balloons: z.array(z.string().max(50)).max(5).default([]),
  photos: z.array(photoSchema).max(5).default([]),
  letter: z.string().max(500).default(''),
  lockUntilMidnight: z.boolean().default(false),
  status: z.enum(['draft', 'preview', 'paid']).default('draft'),
  utm: z.object({
    source: z.string().optional(),
    medium: z.string().optional(),
    campaign: z.string().optional(),
    term: z.string().optional(),
    content: z.string().optional(),
  }).optional(),
});

export const draftUpdateSchema = draftSchema.partial();

export const orderCreateSchema = z.object({
  draftId: z.string().min(1, 'Draft ID is required'),
  contact: z.string().max(100).optional(),
});

export const verifyPaymentSchema = z.object({
  draftId: z.string().min(1, 'Draft ID is required'),
  orderId: z.string().min(1, 'Order ID is required'),
  paymentId: z.string().min(1, 'Payment ID is required'),
  signature: z.string().min(1, 'Signature is required'),
  contact: z.string().optional(),
});

export const eventSchema = z.object({
  name: z.enum([
    'page_view',
    'wizard_step_completed',
    'preview_completed',
    'paywall_viewed',
    'checkout_started',
    'payment_success',
  ]),
  draftId: z.string().optional(),
  sessionId: z.string().min(1, 'Session ID is required'),
  utm: z.record(z.string()).optional(),
  meta: z.record(z.any()).optional(),
});
