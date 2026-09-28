export interface OccasionStepConfig {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface OccasionSceneConfig {
  id: string;
  name: string;
  defaultDuration?: number;
}

export interface OccasionConfig {
  id: string;
  title: string;
  tagline: string;
  theme: {
    primaryGradient: string;
    bgStyle: string;
    accentColor: string;
  };
  steps: OccasionStepConfig[];
  scenes: OccasionSceneConfig[];
}

export const OCCASIONS: Record<string, OccasionConfig> = {
  birthday: {
    id: 'birthday',
    title: 'Birthday Surprise',
    tagline: 'A cinematic, interactive celebration crafted just for them',
    theme: {
      primaryGradient: 'from-rose-500 via-coral-500 to-amber-500',
      bgStyle: 'bg-cream-50',
      accentColor: '#FF7144',
    },
    steps: [
      { id: 'star', name: 'The Star', description: "Who's the birthday star?", required: true },
      { id: 'cake', name: 'The Cake', description: 'Pick their celebratory confection', required: true },
      { id: 'balloons', name: 'The Balloons', description: 'Floating reasons why they are cherished', required: true },
      { id: 'memories', name: 'The Memories', description: 'Snapshots woven on fairy lights', required: false },
      { id: 'letter', name: 'The Letter', description: 'Words straight from your heart', required: true },
    ],
    scenes: [
      { id: 'bow', name: 'Heart & Bow' },
      { id: 'bloom', name: 'Birthday Bloom' },
      { id: 'cake', name: 'The Cake' },
      { id: 'balloons', name: 'Pop the Balloons' },
      { id: 'memories', name: 'Memory Lane' },
      { id: 'letter', name: 'The Letter' },
      { id: 'finale', name: 'Grand Finale' },
    ],
  },
  anniversary: {
    id: 'anniversary',
    title: 'Anniversary Surprise',
    tagline: 'Celebrate your journey, your moments, and your forever love',
    theme: {
      primaryGradient: 'from-pink-500 via-rose-500 to-purple-500',
      bgStyle: 'bg-peach-50',
      accentColor: '#F43F5E',
    },
    steps: [
      { id: 'couple', name: 'The Couple', description: 'The two hearts celebrating today', required: true },
      { id: 'moments', name: 'The Moments', description: 'Cherished milestones along the way', required: true },
      { id: 'promises', name: 'The Promises', description: 'Vows and whispers for the future', required: true },
      { id: 'photos', name: 'The Photos', description: 'Captured memories together', required: false },
      { id: 'letter', name: 'The Letter', description: 'Your romantic anniversary note', required: true },
    ],
    scenes: [
      { id: 'spark', name: 'The Spark' },
      { id: 'timeline', name: 'Our Journey' },
      { id: 'promises', name: 'Floating Promises' },
      { id: 'gallery', name: 'Love Gallery' },
      { id: 'letter', name: 'The Letter' },
      { id: 'toast', name: 'Forever Toast' },
    ],
  },
};

export function getOccasionConfig(occasion: string = 'birthday'): OccasionConfig {
  return OCCASIONS[occasion] || OCCASIONS.birthday;
}
