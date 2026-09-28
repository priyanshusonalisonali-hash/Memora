import React, { useState } from 'react';
import { Sparkles, Trash2, Plus, Heart } from 'lucide-react';
import { useWizardStore } from '../../store/wizardStore.js';

const SUGGESTIONS = [
  'Your laugh makes everyone around you happy',
  'You give the warmest and most comforting hugs',
  'Your fierce loyalty to everyone you love',
  'Our late-night chats about the universe',
  'The way your eyes light up when excited',
  'You never give up on your biggest dreams',
  'You remember the little things that matter',
  'Your hilarious sense of humor and memes',
  'Because you are genuinely one in a million',
  'Your calm wisdom whenever things get chaotic',
  'The songs you randomly sing while cooking',
  'Always being the first person in my corner',
];

export const Step3Balloons: React.FC = () => {
  const { draft, updateDraft, nextStep } = useWizardStore();

  const [balloons, setBalloons] = useState<string[]>(
    draft.balloons && draft.balloons.length > 0 ? draft.balloons : ['', '', '']
  );
  const [error, setError] = useState<string | null>(null);

  const handleTextChange = (index: number, val: string) => {
    const updated = [...balloons];
    updated[index] = val.slice(0, 50);
    setBalloons(updated);
    updateDraft({ balloons: updated.filter((b) => b.trim().length > 0) });
  };

  const handleAddBalloon = () => {
    if (balloons.length < 5) {
      setBalloons([...balloons, '']);
    }
  };

  const handleRemoveBalloon = (index: number) => {
    if (balloons.length > 1) {
      const updated = balloons.filter((_, i) => i !== index);
      setBalloons(updated);
      updateDraft({ balloons: updated.filter((b) => b.trim().length > 0) });
    }
  };

  const handleChipClick = (suggestion: string) => {
    // Find first empty balloon or add a new one if < 5
    const emptyIndex = balloons.findIndex((b) => !b.trim());
    if (emptyIndex !== -1) {
      handleTextChange(emptyIndex, suggestion);
    } else if (balloons.length < 5) {
      const updated = [...balloons, suggestion];
      setBalloons(updated);
      updateDraft({ balloons: updated });
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const validBalloons = balloons.map((b) => b.trim()).filter((b) => b.length > 0);

    if (validBalloons.length < 3) {
      setError('Please add at least 3 reasons for the floating balloons');
      return;
    }

    setError(null);
    updateDraft({ balloons: validBalloons });
    nextStep();
  };

  const isChipUsed = (chip: string) => balloons.some((b) => b.trim().toLowerCase() === chip.toLowerCase());

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-peach-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-peach-100 mx-auto flex items-center justify-center text-coral-500 mb-3 shadow-inner">
          <Heart className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
          The Balloons
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Write reasons why {draft.recipientName || 'they'} are loved. Pop each one in the surprise!
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-3.5">
        <div className="space-y-2.5">
          {balloons.map((balloonText, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-1">
                <span className="font-medium flex items-center gap-1">
                  🎈 Balloon {idx + 1} {idx < 3 && <span className="text-coral-500">*</span>}
                </span>
                <span className={`${balloonText.length >= 45 ? 'text-rose-500 font-semibold' : 'text-gray-400'}`}>
                  {balloonText.length}/50
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={balloonText}
                  onChange={(e) => handleTextChange(idx, e.target.value)}
                  placeholder={`Reason #${idx + 1}...`}
                  maxLength={50}
                  className="w-full px-4 py-2.5 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white focus:ring-2 focus:ring-coral-500/20 outline-none text-gray-900 text-sm font-medium transition-all placeholder-gray-400"
                />
                {balloons.length > 3 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveBalloon(idx)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    aria-label={`Remove balloon ${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {balloons.length < 5 && (
          <button
            type="button"
            onClick={handleAddBalloon}
            className="w-full py-2 px-4 rounded-xl border border-dashed border-peach-300 hover:border-coral-400 text-xs font-semibold text-coral-600 hover:bg-peach-50/50 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add another balloon ({balloons.length}/5)
          </button>
        )}

        {/* Suggestion Chips */}
        <div className="pt-2">
          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Tap to fill ideas:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {SUGGESTIONS.map((chip, i) => {
              const used = isChipUsed(chip);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => !used && handleChipClick(chip)}
                  disabled={used}
                  className={`text-[11px] px-2.5 py-1.5 rounded-xl font-medium transition-all ${
                    used
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 line-through'
                      : 'bg-peach-50 hover:bg-peach-100 text-coral-600 hover:text-coral-700 border border-peach-200 active:scale-95'
                  }`}
                >
                  + {chip}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-[0.98] text-base mt-3"
        >
          Continue to Memories
        </button>
      </form>
    </div>
  );
};
