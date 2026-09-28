import { connectDB, disconnectDB } from '../db/connection.js';
import { Draft } from '../models/Draft.js';
import { Order } from '../models/Order.js';
import { Surprise } from '../models/Surprise.js';
import { logger } from '../utils/logger.js';

async function runSeed() {
  try {
    await connectDB();
    logger.info('🌱 Seeding sample demo data for LumiWish...');

    // 1. Create sample draft
    const draftId = 'demo-draft-123';
    await Draft.deleteOne({ _id: draftId });

    const sampleDraft = new Draft({
      _id: draftId,
      occasion: 'birthday',
      recipientName: 'Aanya',
      senderName: 'Kabir',
      age: 24,
      birthdayDay: 25,
      birthdayMonth: 10,
      cakeId: 'strawberry_blush',
      balloons: [
        'Your laughter lights up the entire room',
        'You always know how to make people feel seen',
        'Our spontaneous late-night chai runs',
        'Your unstoppable ambition and radiant kindness',
        'Because you are genuinely one of a kind',
      ],
      photos: [
        {
          id: 'photo_1',
          url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=80',
          caption: 'Sunset in the hills, 2023',
          order: 0,
        },
        {
          id: 'photo_2',
          url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
          caption: 'Unstoppable smiles on your graduation day',
          order: 1,
        },
      ],
      letter:
        "Happy 24th Birthday, Aanya! Every memory with you feels like sunshine. Thank you for always believing in me, cheering for every little win, and filling every single day with contagious joy. Here is to another chapter filled with dreams coming true, quiet victories, and boundless love.",
      lockUntilMidnight: false,
      status: 'preview',
    });

    await sampleDraft.save();
    logger.info(`✅ Seeded sample draft: ${draftId}`);

    // 2. Create sample published surprise
    const publishedSlug = 'demo-aanya-24';
    await Surprise.deleteOne({ slug: publishedSlug });
    await Order.deleteOne({ _id: 'demo-order-123' });

    const sampleOrder = new Order({
      _id: 'demo-order-123',
      draftId: sampleDraft.id,
      provider: 'razorpay',
      providerOrderId: 'order_demo_seed_999',
      paymentId: 'pay_demo_seed_888',
      amount: 19900,
      currency: 'INR',
      status: 'paid',
      contact: 'kabir@example.com',
    });
    await sampleOrder.save();

    const sampleSurprise = new Surprise({
      slug: publishedSlug,
      draftSnapshot: sampleDraft.toJSON(),
      orderId: sampleOrder.id,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      views: 3,
      firstOpenedAt: new Date(),
    });

    await sampleSurprise.save();
    logger.info(`✨ Seeded sample published surprise at /b/${publishedSlug}`);

    logger.info('🎉 Seeding completed successfully!');
  } catch (error) {
    logger.error({ error }, 'Seeding failed');
  } finally {
    await disconnectDB();
    process.exit(0);
  }
}

runSeed();
