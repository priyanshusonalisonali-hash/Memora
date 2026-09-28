export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface DraftDocument {
  id: string;
  occasion: string;
  recipientName: string;
  senderName: string;
  age?: number;
  birthdayDay?: number;
  birthdayMonth?: number;
  cakeId: string;
  balloons: string[];
  photos: PhotoItem[];
  letter: string;
  lockUntilMidnight: boolean;
  status: 'draft' | 'preview' | 'paid';
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderDocument {
  id: string;
  draftId: string;
  provider: string;
  providerOrderId: string;
  paymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  contact?: string;
  createdAt: Date;
}

export interface SurpriseDocument {
  slug: string;
  draftSnapshot: DraftDocument;
  orderId: string;
  expiresAt: Date;
  views: number;
  firstOpenedAt?: Date;
  createdAt: Date;
}

export interface EventDocument {
  name: string;
  draftId?: string;
  sessionId: string;
  utm?: Record<string, string>;
  meta?: Record<string, any>;
  createdAt: Date;
}
