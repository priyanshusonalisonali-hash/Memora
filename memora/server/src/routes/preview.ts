import { Router, Request, Response } from 'express';
import { Draft } from '../models/Draft.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/:draftId', async (req: Request, res: Response) => {
  try {
    const draft = await Draft.findById(req.params.draftId);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found for preview' });
    }

    return res.json({
      mode: 'preview',
      surprise: {
        slug: `preview-${draft.id}`,
        draftSnapshot: draft.toJSON(),
        isLocked: false,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to load preview');
    return res.status(500).json({ error: 'Failed to load preview experience' });
  }
});

export default router;
