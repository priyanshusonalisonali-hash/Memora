import crypto from 'crypto';
import Razorpay from 'razorpay';
import { config } from '../../config/index.js';
import { logger } from '../../utils/logger.js';

export interface CreateOrderParams {
  amount: number; // in smallest currency unit (paise)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface OrderResult {
  orderId: string;
  amount: number;
  currency: string;
  provider: string;
  keyId: string;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface PaymentProvider {
  createOrder(params: CreateOrderParams): Promise<OrderResult>;
  verifySignature(params: VerifySignatureParams): boolean;
  verifyWebhook(rawBody: string | Buffer, signature: string): boolean;
}

export class RazorpayPaymentProvider implements PaymentProvider {
  private razorpay: Razorpay;
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor(keyId?: string, keySecret?: string, webhookSecret?: string) {
    this.keyId = keyId || config.razorpay.keyId || 'rzp_test_placeholder';
    this.keySecret = keySecret || config.razorpay.keySecret || 'test_secret_placeholder';
    this.webhookSecret = webhookSecret || config.razorpay.webhookSecret;

    this.razorpay = new Razorpay({
      key_id: this.keyId,
      key_secret: this.keySecret,
    });
  }

  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const options = {
      amount: params.amount,
      currency: params.currency,
      receipt: params.receipt,
      notes: params.notes,
    };

    const order = await this.razorpay.orders.create(options);

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      provider: 'razorpay',
      keyId: this.keyId,
    };
  }

  verifySignature(params: VerifySignatureParams): boolean {
    const { orderId, paymentId, signature } = params;
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', this.keySecret)
      .update(body)
      .digest('hex');

    return expectedSignature === signature;
  }

  verifyWebhook(rawBody: string | Buffer, signature: string): boolean {
    if (!this.webhookSecret) return false;
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(rawBody)
      .digest('hex');

    return expectedSignature === signature;
  }
}

export class MockPaymentProvider implements PaymentProvider {
  async createOrder(params: CreateOrderParams): Promise<OrderResult> {
    const mockOrderId = `order_mock_${crypto.randomUUID().slice(0, 14)}`;
    logger.info({ mockOrderId, params }, 'Created mock order for test environment');
    return {
      orderId: mockOrderId,
      amount: params.amount,
      currency: params.currency,
      provider: 'mock',
      keyId: 'rzp_test_mock_key',
    };
  }

  verifySignature(params: VerifySignatureParams): boolean {
    // In mock mode, any signature or mock signature is accepted
    logger.info({ params }, 'Verifying mock payment signature');
    return true;
  }

  verifyWebhook(_rawBody: string | Buffer, _signature: string): boolean {
    return true;
  }
}

export function getPaymentProvider(): PaymentProvider {
  if (config.razorpay.keyId && config.razorpay.keySecret) {
    return new RazorpayPaymentProvider();
  }
  logger.info('Razorpay keys not set; using MockPaymentProvider for testing & development');
  return new MockPaymentProvider();
}
