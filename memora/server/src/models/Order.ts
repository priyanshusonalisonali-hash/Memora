import mongoose, { Schema, Document } from 'mongoose';
import { OrderDocument } from '../types/index.js';

export interface IOrder extends Document, Omit<OrderDocument, 'id'> {
  _id: string;
}

const OrderSchema = new Schema<IOrder>({
  _id: { type: String, required: true },
  draftId: { type: String, required: true, ref: 'Draft' },
  provider: { type: String, required: true, default: 'razorpay' },
  providerOrderId: { type: String, required: true },
  paymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'INR' },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
  contact: { type: String },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
