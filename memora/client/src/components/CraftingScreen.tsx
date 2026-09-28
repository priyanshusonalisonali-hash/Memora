import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWizardStore } from '../store/wizardStore.js';
import { sound } from '../utils/sound.js';
import { fireBurst } from '../utils/confetti.js';

export const CraftingScreen: React.FC = () => {
  const { draft, setIsCrafting } = useWizardStore();
  const navigate = useNavigate();

  const cakeNames: Record<string, string> = {
    midnight_chocolate: 'Midnight Chocolate',
    strawberry_blush: 'Strawberry Blush',
    vanilla_gold: 'Vanilla Gold',
  };

  const recipient = draft.recipientName || 'your favorite person';
  const sender = draft.senderName || 'you';
  const cake = cakeNames[draft.cakeId] || 'celebration cake';
  const ageText = draft.age ? `for turning ${draft.age}` : 'of joy & wishes';
  const balloonCount = draft.balloons?.length || 3;
  const photoCount = draft.photos?.length || 0;

  const steps = [
    `Baking the ${cake}`,
    `Lighting candles ${ageText}`,
    `Filling ${balloonCount} balloons with your words`,
    ...(photoCount > 0 ? [`Hanging ${photoCount} memories on fairy lights`] : []),
    'Sealing your letter inside the card',
    `Signed with love — ${sender}`,
  ];

  const [currentCheckIndex, setCurrentCheckIndex] = useState<number>(0);
  const [progress, setProgress] = useState<number>(10);

  useEffect(() => {
    const stepDuration = 800;
    const timer = setInterval(() => {
      setCurrentCheckIndex((prev) => {
        if (prev < steps.length) {
          sound.playChime();
          const nextIndex = prev + 1;
          setProgress(Math.round((nextIndex / steps.length) * 100));
          return nextIndex;
        } else {
          clearInterval(timer);
          fireBurst();
          // After finishing all items, transition to preview mode
          setTimeout(() => {
            setIsCrafting(false);
            navigate(`/preview/${draft.id || 'current'}`);
          }, 800);
          return prev;
        }
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="fixed inset-0 z-50 bg-cream-50/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-floating border border-peach-100 text-center animate-fadeIn">
        {/* Animated Magic Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-coral-500 to-amber-400 mx-auto flex items-center justify-center text-white mb-4 shadow-lg shadow-coral-500/30 animate-pulseGlow">
          <Sparkles className="w-8 h-8 animate-spin" />
        </div>

        <h2 className="font-heading text-2xl font-bold text-gray-900 mb-1">
          Crafting {recipient}'s surprise...
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          Assembling your personal magic touch by touch
        </p>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-peach-100 rounded-full overflow-hidden mb-6 relative">
          <div
            className="h-full bg-gradient-to-r from-coral-500 via-rose-500 to-amber-400 transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Personalized Checklist */}
        <div className="space-y-3 text-left">
          {steps.map((stepText, idx) => {
            const isDone = idx < currentCheckIndex;
            const isCurrent = idx === currentCheckIndex;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone
                    ? 'text-gray-900 font-semibold'
                    : isCurrent
                    ? 'text-coral-600 font-bold scale-[1.02]'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isDone
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : isCurrent
                      ? 'border-coral-500 bg-peach-50 text-coral-500 animate-pulse'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {isDone ? (
                    <Check className="w-3 h-3 stroke-[3]" />
                  ) : isCurrent ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-coral-500" />
                  ) : null}
                </div>
                <span className="line-clamp-1">{stepText}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
