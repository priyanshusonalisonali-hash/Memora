import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { RazorpayPaymentProvider, MockPaymentProvider } from './index.js';

describe('PaymentProvider Tests', () => {
  it('MockPaymentProvider should create order and verify signature', async () => {
    const provider = new MockPaymentProvider();
    const order = await provider.createOrder({
      amount: 19900,
      currency: 'INR',
      receipt: 'rcpt_test_1',
    });

    expect(order.orderId).toContain('order_mock_');
    expect(order.amount).toBe(19900);
    expect(order.currency).toBe('INR');

    const isValid = provider.verifySignature({
      orderId: order.orderId,
      paymentId: 'pay_test_1',
      signature: 'dummy_sig',
    });
    expect(isValid).toBe(true);
  });

  it('Razorpay HMAC signature verification works correctly with matching secret', () => {
    const provider = new RazorpayPaymentProvider('rzp_test_sample', 'super_secret_test_key_123');
    const orderId = 'order_test_999';
    const paymentId = 'pay_test_888';

    // Compute legitimate HMAC
    const expectedSignature = crypto
      .createHmac('sha256', 'super_secret_test_key_123')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const verified = provider.verifySignature({
      orderId,
      paymentId,
      signature: expectedSignature,
    });
    expect(verified).toBe(true);

    const tampered = provider.verifySignature({
      orderId,
      paymentId,
      signature: 'tampered_wrong_signature',
    });
    expect(tampered).toBe(false);
  });
});
