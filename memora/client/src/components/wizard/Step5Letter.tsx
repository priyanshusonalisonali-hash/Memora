import React, { useState } from 'react';
import { Sparkles, Mail, Heart, Wand2 } from 'lucide-react';
import { useWizardStore } from '../../store/wizardStore.js';

export const Step5Letter: React.FC = () => {
  const { draft, updateDraft, setIsCrafting, saveToServer } = useWizardStore();

  const recipient = draft.recipientName || 'you';
  const sender = draft.senderName || 'Me';
  const age = draft.age ? `turning ${draft.age}` : 'this wonderful milestone';

  const TEMPLATES = [
    {
      title: 'Deep & Emotional',
      text: `Happy Birthday, ${recipient}! Words will never quite capture how grateful I am to have you in my life. Seeing you grow, thrive, and reach ${age} is such an honor. Never stop shining your gentle light on everyone around you. I love you endlessly.`,
    },
    {
      title: 'Warm & Playful',
      text: `Happy Birthday to my favorite human, ${recipient}! Another year wiser, bolder, and somehow even more legendary. Thank you for all the laughs, wild adventures, and memories we cherish. May this year bring you all the magic you deserve!`,
    },
    {
      title: 'Short & Poetic',
      text: `To ${recipient} — on your special day. May your coming days be sweet, your laughter effortless, and your heart peaceful. Here is to celebrating ${age} with boundless love and joyful horizons. Forever cheering for you!`,
    },
  ];

  const [letter, setLetter] = useState(draft.letter || '');
  const [error, setError] = useState<string | null>(null);

  const handleApplyTemplate = (text: string) => {
    setLetter(text.slice(0, 500));
    updateDraft({ letter: text.slice(0, 500) });
  };

  const handleBakeMagic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!letter.trim()) {
      setError('Please write a short letter or pick one of the heartfelt templates');
      return;
    }

    setError(null);
    updateDraft({ letter: letter.trim() });
    await saveToServer();
    // Launch animated crafting screen
    setIsCrafting(true);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-peach-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-peach-100 mx-auto flex items-center justify-center text-coral-500 mb-3 shadow-inner">
          <Mail className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
          The Letter
        </h2>
        <p className="text-sm text-coral-600 font-medium mt-1">
          "They're going to read this twice"
        </p>
      </div>

      <form onSubmit={handleBakeMagic} className="space-y-4">
        {/* Templates suggestions */}
        <div>
          <label className="text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-amber-500" />
            Pick a heartfelt starter:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyTemplate(tmpl.text)}
                className="p-2 text-left rounded-xl bg-cream-50 hover:bg-peach-100/60 border border-peach-200 transition-all text-gray-700 active:scale-95"
              >
                <span className="block text-[11px] font-bold text-coral-600">
                  {tmpl.title}
                </span>
                <span className="block text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                  Tap to insert
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={letter}
            onChange={(e) => {
              const val = e.target.value.slice(0, 500);
              setLetter(val);
              updateDraft({ letter: val });
            }}
            rows={6}
            placeholder={`Dear ${recipient},\n\nHappy Birthday! I wanted to remind you today of...`}
            className="w-full p-4 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white focus:ring-2 focus:ring-coral-500/20 outline-none text-gray-800 text-sm font-handwriting text-lg leading-relaxed transition-all resize-none placeholder-gray-400"
          />
          <div className="flex items-center justify-between text-xs mt-1 px-1">
            <span className="text-gray-400 font-sans text-[11px]">
              With love, {sender}
            </span>
            <span
              className={`font-sans text-[11px] font-medium ${
                letter.length >= 480 ? 'text-rose-500' : 'text-gray-400'
              }`}
            >
              {letter.length}/500
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-[0.98] text-lg flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5 animate-spin" />
          Bake the magic
        </button>
      </form>
    </div>
  );
};
