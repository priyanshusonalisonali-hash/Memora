import { Router, Request, Response } from 'express';
import { Surprise } from '../models/Surprise.js';
import { logger } from '../utils/logger.js';

const router = Router();

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const surprise = await Surprise.findOne({ slug });

    if (!surprise) {
      return res.status(404).json({ error: 'Surprise not found. Please verify the link.' });
    }

    const now = new Date();

    // Check expiry
    if (surprise.expiresAt && surprise.expiresAt < now) {
      return res.status(410).json({
        expired: true,
        error: 'This surprise link has expired. LumiWish links remain active for 90 days.',
      });
    }

    const draft = surprise.draftSnapshot;

    // Check lock until midnight
    if (draft.lockUntilMidnight && draft.birthdayDay && draft.birthdayMonth) {
      const currentYear = now.getFullYear();
      // Target midnight: 00:00:00 on the recipient's birthday
      let targetDate = new Date(currentYear, draft.birthdayMonth - 1, draft.birthdayDay, 0, 0, 0);

      // If target date has already passed this year by more than 2 days, lock could be for next year or unlocked
      // If targetDate is still in the future:
      if (targetDate.getTime() > now.getTime()) {
        return res.json({
          isLocked: true,
          recipientName: draft.recipientName,
          senderName: draft.senderName,
          unlocksAt: targetDate.toISOString(),
          message: `Shh... this surprise is locked until midnight on ${draft.birthdayDay}/${draft.birthdayMonth}!`,
        });
      }
    }

    // Increment views & record first opened time
    surprise.views = (surprise.views || 0) + 1;
    if (!surprise.firstOpenedAt) {
      surprise.firstOpenedAt = now;
    }
    await surprise.save();

    return res.json({
      isLocked: false,
      surprise: {
        slug: surprise.slug,
        draftSnapshot: surprise.draftSnapshot,
        views: surprise.views,
        firstOpenedAt: surprise.firstOpenedAt,
        expiresAt: surprise.expiresAt,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Failed to fetch public surprise');
    return res.status(500).json({ error: 'Internal server error fetching surprise' });
  }
});

export default router;
