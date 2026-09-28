export interface PhotoItem {
  id: string;
  url: string;
  caption?: string;
  order: number;
  previewUrl?: string; // local preview for instant UI feedback
  file?: File;
}

export interface DraftData {
  id?: string;
  occasion: string;
  recipientName: string;
  senderName: string;
  age?: number;
  birthdayDay?: number;
  birthdayMonth?: number;
  cakeId: 'midnight_chocolate' | 'strawberry_blush' | 'vanilla_gold';
  balloons: string[];
  photos: PhotoItem[];
  letter: string;
  lockUntilMidnight: boolean;
  status: 'draft' | 'preview' | 'paid';
}

export interface SurpriseData {
  slug: string;
  draftSnapshot: DraftData;
  expiresAt: string;
  views: number;
  firstOpenedAt?: string;
}

export interface OccasionStep {
  id: string;
  name: string;
  description: string;
  required: boolean;
}
