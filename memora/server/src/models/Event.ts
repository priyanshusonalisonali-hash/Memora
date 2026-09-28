import mongoose, { Schema, Document } from 'mongoose';
import { EventDocument } from '../types/index.js';

export interface IEvent extends Document, EventDocument {}

const EventSchema = new Schema<IEvent>({
  name: { type: String, required: true, index: true },
  draftId: { type: String, index: true },
  sessionId: { type: String, required: true, index: true },
  utm: { type: Schema.Types.Mixed },
  meta: { type: Schema.Types.Mixed },
}, {
  timestamps: true,
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
