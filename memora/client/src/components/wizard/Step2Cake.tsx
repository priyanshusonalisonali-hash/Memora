import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useWizardStore } from '../../store/wizardStore.js';

interface CakeOption {
  id: 'midnight_chocolate' | 'strawberry_blush' | 'vanilla_gold';
  name: string;
  tagline: string;
  description: string;
  badge: string;
  colorScheme: {
    bg: string;
    border: string;
    glow: string;
    frosting: string;
    base: string;
    accents: string;
  };
}

const CAKES: CakeOption[] = [
  {
    id: 'midnight_chocolate',
    name: 'Midnight Chocolate',
    tagline: 'Decadent dark cocoa & espresso ganache',
    description: 'Rich layers of dark chocolate ganache topped with sparkling gold dust and velvety truffles.',
    badge: 'Most Popular',
    colorScheme: {
      bg: 'from-amber-950/10 to-stone-900/5',
      border: 'border-amber-900/30',
      glow: 'shadow-amber-900/20',
      frosting: '#3E2723',
      base: '#271915',
      accents: '#FFD700',
    },
  },
  {
    id: 'strawberry_blush',
    name: 'Strawberry Blush',
    tagline: 'Fresh berries & whipped pink chiffon',
    description: 'Fluffy sponge draped in strawberry buttercream, decorated with fresh garden raspberries.',
    badge: 'Sweet & Romantic',
    colorScheme: {
      bg: 'from-rose-50 to-pink-50',
      border: 'border-rose-200',
      glow: 'shadow-rose-400/20',
      frosting: '#FB7185',
      base: '#FFF1F2',
      accents: '#E11D48',
    },
  },
  {
    id: 'vanilla_gold',
    name: 'Vanilla Gold',
    tagline: 'Madagascar vanilla & caramel drizzle',
    description: 'Golden buttery sponge with whipped Chantilly cream and ribbons of spun amber caramel.',
    badge: 'Timeless Classic',
    colorScheme: {
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
      glow: 'shadow-amber-400/20',
      frosting: '#FBBF24',
      base: '#FEF3C7',
      accents: '#D97706',
    },
  },
];

export const Step2Cake: React.FC = () => {
  const { draft, updateDraft, nextStep } = useWizardStore();
  const selectedCake = draft.cakeId || 'midnight_chocolate';

  const handleSelect = (id: CakeOption['id']) => {
    updateDraft({ cakeId: id });
  };

  const handleContinue = () => {
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-peach-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-peach-100 mx-auto flex items-center justify-center text-coral-500 mb-3 shadow-inner">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
          The Cake
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Pick their celebratory confection for the candle-blowing scene.
        </p>
      </div>

      <div className="space-y-3.5 mb-6">
        {CAKES.map((cake) => {
          const isSelected = selectedCake === cake.id;

          return (
            <div
              key={cake.id}
              onClick={() => handleSelect(cake.id)}
              className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                isSelected
                  ? 'border-coral-500 bg-peach-50/70 shadow-md scale-[1.01]'
                  : 'border-peach-100 bg-cream-50/60 hover:border-peach-300 hover:bg-cream-50'
              }`}
            >
              {/* Cake SVG Illustration */}
              <div className="w-16 h-16 rounded-xl bg-white flex-shrink-0 flex items-center justify-center shadow-sm p-1 border border-peach-100/50">
                <svg viewBox="0 0 64 64" className="w-12 h-12">
                  {/* Candle flame */}
                  <path
                    d="M32 10 C32 8, 34 6, 32 4 C30 6, 32 8, 32 10 Z"
                    fill="#FFB703"
                    className="animate-pulse"
                  />
                  {/* Candle stick */}
                  <rect x="30.5" y="10" width="3" height="8" rx="1.5" fill="#E2E8F0" />
                  {/* Top Tier */}
                  <rect
                    x="20"
                    y="18"
                    width="24"
                    height="14"
                    rx="3"
                    fill={cake.colorScheme.frosting}
                  />
                  {/* Top Tier decorative frosting drops */}
                  <circle cx="23" cy="20" r="1.5" fill={cake.colorScheme.accents} />
                  <circle cx="32" cy="20" r="1.5" fill={cake.colorScheme.accents} />
                  <circle cx="41" cy="20" r="1.5" fill={cake.colorScheme.accents} />
                  {/* Bottom Tier */}
                  <rect
                    x="12"
                    y="32"
                    width="40"
                    height="18"
                    rx="4"
                    fill={cake.colorScheme.frosting}
                  />
                  {/* Ribbon/creamy middle */}
                  <rect
                    x="12"
                    y="39"
                    width="40"
                    height="3"
                    fill={cake.colorScheme.accents}
                    opacity="0.8"
                  />
                  {/* Cake Plate */}
                  <ellipse cx="32" cy="52" rx="26" ry="3.5" fill="#CBD5E1" />
                </svg>
              </div>

              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-heading font-bold text-gray-900 text-base leading-tight">
                    {cake.name}
                  </h3>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-peach-100 text-coral-600">
                    {cake.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-1">{cake.tagline}</p>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{cake.description}</p>
              </div>

              {/* Selection Checkbox */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                  isSelected
                    ? 'border-coral-500 bg-coral-500 text-white'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-[0.98] text-base"
      >
        Continue to The Balloons
      </button>
    </div>
  );
};
