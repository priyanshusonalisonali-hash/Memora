export interface Testimonial {
  id: string;
  name: string;
  relation: string;
  avatar: string;
  comment: string;
  rating: number;
}

// Placeholder social proof content - clearly marked for replacement with live user reviews
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Rhea S.',
    relation: 'Sent to her best friend',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    comment: 'She literally burst into happy tears when the candle blowing and balloons opened. Best ₹199 I have ever spent!',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Arjun M.',
    relation: 'Sent to his sister turning 21',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    comment: 'The midnight countdown lock was genius. She waited until 12:00 AM sharp and loved the photo garland.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Meera K.',
    relation: 'Sent to her partner',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    comment: 'So much more thoughtful and lasting than just a generic greeting card. The handwritten letter gave chills.',
    rating: 5,
  },
];
