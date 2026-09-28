import { Router, Request, Response } from 'express';
import { Event } from '../models/Event.js';
import { eventSchema } from '../validations/index.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const { name, draftId, sessionId, utm, meta } = parsed.data;

    const event = new Event({
      name,
      draftId,
      sessionId,
      utm,
      meta,
    });

    await event.save();
    return res.status(201).json({ success: true, id: event._id });
  } catch (error) {
    logger.error({ error }, 'Failed to record analytics event');
    return res.status(500).json({ error: 'Failed to record event' });
  }
});

export default router;
