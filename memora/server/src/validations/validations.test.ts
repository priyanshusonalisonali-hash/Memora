import { describe, it, expect } from 'vitest';
import { draftSchema, orderCreateSchema, verifyPaymentSchema, eventSchema } from './index.js';

describe('Validation Schemas', () => {
  describe('draftSchema', () => {
    it('should validate a complete valid draft', () => {
      const validDraft = {
        occasion: 'birthday',
        recipientName: 'Aanya',
        senderName: 'Kabir',
        age: 25,
        birthdayDay: 15,
        birthdayMonth: 8,
        cakeId: 'strawberry_blush',
        balloons: ['Reason 1', 'Reason 2', 'Reason 3'],
        photos: [],
        letter: 'Happy birthday dearest friend!',
        lockUntilMidnight: true,
      };

      const result = draftSchema.safeParse(validDraft);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.recipientName).toBe('Aanya');
        expect(result.data.cakeId).toBe('strawberry_blush');
      }
    });

    it('should reject invalid age (>120)', () => {
      const invalidDraft = {
        recipientName: 'John',
        senderName: 'Jane',
        age: 150,
      };

      const result = draftSchema.safeParse(invalidDraft);
      expect(result.success).toBe(false);
    });

    it('should reject invalid cakeId', () => {
      const invalidDraft = {
        cakeId: 'unknown_cake',
      };

      const result = draftSchema.safeParse(invalidDraft);
      expect(result.success).toBe(false);
    });

    it('should enforce maximum 5 balloons', () => {
      const tooManyBalloons = {
        balloons: ['1', '2', '3', '4', '5', '6'],
      };

      const result = draftSchema.safeParse(tooManyBalloons);
      expect(result.success).toBe(false);
    });
  });

  describe('orderCreateSchema', () => {
    it('should validate valid order create payload', () => {
      const result = orderCreateSchema.safeParse({
        draftId: 'draft-12345',
        contact: 'test@example.com',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing draftId', () => {
      const result = orderCreateSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('verifyPaymentSchema', () => {
    it('should validate complete signature payload', () => {
      const result = verifyPaymentSchema.safeParse({
        draftId: 'draft-123',
        orderId: 'order_123',
        paymentId: 'pay_123',
        signature: 'abcdef123456',
      });
      expect(result.success).toBe(true);
    });

    it('should fail if signature is missing', () => {
      const result = verifyPaymentSchema.safeParse({
        draftId: 'draft-123',
        orderId: 'order_123',
        paymentId: 'pay_123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('eventSchema', () => {
    it('should accept recognized event names', () => {
      const result = eventSchema.safeParse({
        name: 'wizard_step_completed',
        sessionId: 'sess-abc-123',
        meta: { step: 2 },
      });
      expect(result.success).toBe(true);
    });

    it('should reject unknown event names', () => {
      const result = eventSchema.safeParse({
        name: 'unknown_random_event',
        sessionId: 'sess-abc-123',
      });
      expect(result.success).toBe(false);
    });
  });
});
