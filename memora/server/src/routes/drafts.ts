import { Router, Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { Draft } from '../models/Draft.js';
import { draftSchema, draftUpdateSchema } from '../validations/index.js';
import { sanitizeText } from '../utils/sanitize.js';
import { getStorageProvider } from '../services/storage/index.js';
import { logger } from '../utils/logger.js';

const router = Router();
const storage = getStorageProvider();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPG, PNG, WEBP) are allowed'));
    }
  },
});

// Create draft
router.post('/', async (req: Request, res: Response) => {
  try {
    const parsed = draftSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const data = parsed.data;
    const id = nanoid(14);

    const draft = new Draft({
      _id: id,
      occasion: data.occasion || 'birthday',
      recipientName: sanitizeText(data.recipientName),
      senderName: sanitizeText(data.senderName),
      age: data.age,
      birthdayDay: data.birthdayDay,
      birthdayMonth: data.birthdayMonth,
      cakeId: data.cakeId,
      balloons: (data.balloons || []).map((b) => sanitizeText(b)),
      photos: data.photos || [],
      letter: sanitizeText(data.letter),
      lockUntilMidnight: data.lockUntilMidnight,
      status: 'draft',
      utm: data.utm,
    });

    await draft.save();
    return res.status(201).json(draft.toJSON());
  } catch (error) {
    logger.error({ error }, 'Failed to create draft');
    return res.status(500).json({ error: 'Internal server error creating draft' });
  }
});

// Get draft
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }
    return res.json(draft.toJSON());
  } catch (error) {
    logger.error({ error }, 'Failed to retrieve draft');
    return res.status(500).json({ error: 'Internal server error retrieving draft' });
  }
});

// Update draft
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const parsed = draftUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.format() });
    }

    const draft = await Draft.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const data = parsed.data;
    if (data.recipientName !== undefined) draft.recipientName = sanitizeText(data.recipientName);
    if (data.senderName !== undefined) draft.senderName = sanitizeText(data.senderName);
    if (data.age !== undefined) draft.age = data.age ?? undefined;
    if (data.birthdayDay !== undefined) draft.birthdayDay = data.birthdayDay ?? undefined;
    if (data.birthdayMonth !== undefined) draft.birthdayMonth = data.birthdayMonth ?? undefined;
    if (data.cakeId !== undefined) draft.cakeId = data.cakeId;
    if (data.balloons !== undefined) draft.balloons = data.balloons.map((b) => sanitizeText(b));
    if (data.letter !== undefined) draft.letter = sanitizeText(data.letter);
    if (data.lockUntilMidnight !== undefined) draft.lockUntilMidnight = data.lockUntilMidnight;
    if (data.photos !== undefined) draft.photos = data.photos;
    if (data.status !== undefined) draft.status = data.status;

    await draft.save();
    return res.json(draft.toJSON());
  } catch (error) {
    logger.error({ error }, 'Failed to update draft');
    return res.status(500).json({ error: 'Internal server error updating draft' });
  }
});

// Upload photos to draft
router.post('/:id/photos', upload.array('photos', 5), async (req: Request, res: Response) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (draft.photos.length + files.length > 5) {
      return res.status(400).json({ error: 'Maximum 5 photos allowed per surprise' });
    }

    const newPhotos = [];
    let nextOrder = draft.photos.length;

    for (const file of files) {
      // Magic byte / Sharp verification and processing:
      // Resize to max 1600x1600 preserving aspect ratio, strip EXIF, convert to compressed webp
      const processedBuffer = await sharp(file.buffer)
        .rotate() // auto-rotate based on EXIF before stripping
        .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

      const photoId = nanoid(10);
      const fileUrl = await storage.uploadFile(
        processedBuffer,
        `${photoId}.webp`,
        'image/webp'
      );

      const photoItem = {
        id: photoId,
        url: fileUrl,
        caption: req.body.caption ? sanitizeText(req.body.caption) : '',
        order: nextOrder++,
      };

      draft.photos.push(photoItem);
      newPhotos.push(photoItem);
    }

    await draft.save();
    return res.status(201).json({
      photos: draft.photos,
      added: newPhotos,
    });
  } catch (error: any) {
    logger.error({ error }, 'Failed to upload photo');
    return res.status(500).json({ error: error.message || 'Error processing photo upload' });
  }
});

// Delete a photo from draft
router.delete('/:id/photos/:photoId', async (req: Request, res: Response) => {
  try {
    const draft = await Draft.findById(req.params.id);
    if (!draft) {
      return res.status(404).json({ error: 'Draft not found' });
    }

    const photoIndex = draft.photos.findIndex((p) => p.id === req.params.photoId);
    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found in draft' });
    }

    const [removed] = draft.photos.splice(photoIndex, 1);
    await draft.save();

    // Remove from storage in background
    storage.deleteFile(removed.url).catch((err) => {
      logger.warn({ err, url: removed.url }, 'Failed to delete photo from storage');
    });

    return res.json({ success: true, photos: draft.photos });
  } catch (error) {
    logger.error({ error }, 'Failed to delete photo');
    return res.status(500).json({ error: 'Internal server error deleting photo' });
  }
});

export default router;
