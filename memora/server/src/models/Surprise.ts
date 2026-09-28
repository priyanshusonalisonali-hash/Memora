import mongoose, { Schema, Document } from 'mongoose';
import { SurpriseDocument } from '../types/index.js';

export interface ISurprise extends Document, SurpriseDocument {}

const SurpriseSchema = new Schema<ISurprise>({
  slug: { type: String, required: true, unique: true, index: true },
  draftSnapshot: { type: Schema.Types.Mixed, required: true },
  orderId: { type: String, required: true, ref: 'Order' },
  expiresAt: { type: Date, required: true, index: true },
  views: { type: Number, default: 0 },
  firstOpenedAt: { type: Date },
}, {
  timestamps: true,
});

export const Surprise = mongoose.model<ISurprise>('Surprise', SurpriseSchema);
