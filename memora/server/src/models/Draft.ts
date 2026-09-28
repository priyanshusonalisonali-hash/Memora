import mongoose, { Schema } from 'mongoose';
import { DraftDocument, PhotoItem } from '../types/index.js';

export interface IDraft extends Omit<DraftDocument, 'id'> {
  _id: string;
}

const PhotoSchema = new Schema<PhotoItem>({
  id: { type: String, required: true },
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  order: { type: Number, required: true, default: 0 },
}, { _id: false });

const DraftSchema = new Schema<IDraft>({
  _id: { type: String, required: true },
  occasion: { type: String, required: true, default: 'birthday' },
  recipientName: { type: String, default: '' },
  senderName: { type: String, default: '' },
  age: { type: Number },
  birthdayDay: { type: Number },
  birthdayMonth: { type: Number },
  cakeId: { type: String, default: 'midnight_chocolate' },
  balloons: { type: [String], default: [] },
  photos: { type: [PhotoSchema], default: [] },
  letter: { type: String, default: '' },
  lockUntilMidnight: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['draft', 'preview', 'paid'],
    default: 'draft'
  },
  utm: {
    source: String,
    medium: String,
    campaign: String,
    term: String,
    content: String,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      const obj = ret as any;
      obj.id = obj._id;

      const { _id, __v, ...cleanRet } = obj;

      return cleanRet;
    },
  },
});

export const Draft = mongoose.model<IDraft>('Draft', DraftSchema);