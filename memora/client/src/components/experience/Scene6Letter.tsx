import React, { useState, useEffect, useRef } from 'react';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/sound.js';

interface SceneProps {
  onComplete: () => void;
  letter: string;
  recipientName: string;
  senderName: string;
}

export const Scene6Letter: React.FC<SceneProps> = ({
  onComplete,
  letter,
  recipientName,
  senderName,
}) => {
  const [displayedChars, setDisplayedChars] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  const fullLetter = letter || `Happy Birthday, ${recipientName}! Here is wishing you a year filled with laughter, unforgettable adventures, and every dream fulfilled.`;

  useEffect(() => {
    let index = 0;
    timerRef.current = setInterval(() => {
      index += 2; // two chars per tick for smooth natural typewriter speed
      if (index >= fullLetter.length) {
        setDisplayedChars(fullLetter.length);
        setIsDone(true);
        clearInterval(timerRef.current);
      } else {
        setDisplayedChars(index);
      }
    }, 28);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fullLetter]);

  const handleSkipOrComplete = () => {
    if (!isDone) {
      // Tap to skip typewriter
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedChars(fullLetter.length);
      setIsDone(true);
    } else {
      sound.playChime();
      onComplete();
    }
  };

  return (
    <div
      onClick={handleSkipOrComplete}
      className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-10 px-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="text-center z-10 space-y-1">
        <span className="text-xs uppercase tracking-widest text-coral-500 font-bold bg-peach-100 px-3 py-1 rounded-full">
          Sealed With Love
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          A Letter For You
        </h2>
      </div>

      {/* Paper Card Letter */}
      <div className="relative z-10 my-auto w-full max-w-sm bg-[#FFFDF7] rounded-3xl p-6 sm:p-8 shadow-floating border border-amber-200/60 transition-transform">
        {/* Decorative stamp in top right */}
        <div className="absolute top-5 right-5 w-12 h-14 border-2 border-dashed border-coral-300 rounded-lg flex flex-col items-center justify-center p-1 opacity-70">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span className="text-[8px] font-sans font-bold text-coral-500 uppercase mt-0.5">
            LumiLove
          </span>
        </div>

        {/* Salutation */}
        <h3 className="font-handwriting text-3xl font-bold text-gray-900 mb-4">
          Dear {recipientName},
        </h3>

        {/* Typed letter body */}
        <div className="font-handwriting text-2xl sm:text-2xl text-gray-800 leading-relaxed min-h-[160px] whitespace-pre-wrap">
          {fullLetter.slice(0, displayedChars)}
          {!isDone && <span className="animate-pulse text-coral-500 font-bold">|</span>}
        </div>

        {/* Sign-off */}
        {isDone && (
          <div className="mt-6 pt-4 border-t border-amber-200/50 flex items-center justify-between animate-fadeIn">
            <span className="text-xs text-gray-400 font-sans">
              Written just for you
            </span>
            <div className="text-right">
              <span className="font-handwriting text-2xl font-bold text-coral-600">
                — {senderName}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tap hint */}
      <div className="relative z-10 text-center pb-4">
        <span className="text-xs font-semibold text-coral-600 bg-white/90 px-4 py-2 rounded-full shadow-soft border border-peach-100 inline-flex items-center gap-1.5">
          <span>{isDone ? 'Tap for the finale celebration 🎉' : 'Tap to reveal full letter'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
