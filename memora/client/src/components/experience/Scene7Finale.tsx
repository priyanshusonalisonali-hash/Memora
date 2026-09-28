import React, { useEffect } from 'react';
import { Sparkles, Heart, RotateCcw, Send, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { startContinuousShower } from '../../utils/confetti.js';
import { sound } from '../../utils/sound.js';

interface SceneProps {
  mode: 'preview' | 'live';
  recipientName: string;
  senderName: string;
  onOpenPaywall?: () => void;
  onReplay?: () => void;
}

export const Scene7Finale: React.FC<SceneProps> = ({
  mode,
  recipientName,
  senderName,
  onOpenPaywall,
  onReplay,
}) => {
  useEffect(() => {
    sound.playChime();
    // Continuous celebratory confetti shower
    const stopShower = startContinuousShower();
    return () => {
      stopShower();
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-12 px-6 select-none overflow-hidden">
      {/* Top Tagline */}
      <div className="text-center z-10 space-y-1 animate-fadeIn">
        <span className="text-xs uppercase tracking-widest text-coral-600 font-extrabold bg-peach-100 px-4 py-1.5 rounded-full shadow-sm">
          A Year Full of Wonders
        </span>
      </div>

      {/* Grand Celebration Card */}
      <div className="relative z-10 my-auto text-center space-y-4 max-w-sm mx-auto animate-scaleUp">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-coral-500 via-rose-500 to-amber-400 mx-auto flex items-center justify-center text-white shadow-floating animate-pulseGlow">
          <Sparkles className="w-10 h-10 animate-spin" />
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          HAPPY BIRTHDAY,{' '}
          <span className="bg-gradient-to-r from-coral-600 via-rose-500 to-amber-500 bg-clip-text text-transparent block mt-1">
            {recipientName}!
          </span>
        </h1>

        <p className="font-heading text-lg text-gray-700 font-medium">
          "Made with love, just for you"
        </p>

        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/90 shadow-soft border border-peach-200 text-sm font-semibold text-gray-800">
          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
          <span>From {senderName}</span>
        </div>
      </div>

      {/* Bottom Action CTAs depending on Preview or Live Mode */}
      <div className="relative z-20 w-full max-w-sm space-y-3 pb-4">
        {mode === 'preview' ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={onOpenPaywall}
              className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-95 text-lg flex items-center justify-center gap-2 touch-target"
            >
              <Send className="w-5 h-5" />
              Send it to {recipientName}
            </button>
            <p className="text-center text-[11px] text-gray-400 font-medium">
              Unlock the private shareable link for {recipientName}
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            {onReplay && (
              <button
                type="button"
                onClick={onReplay}
                className="w-full py-3.5 px-6 rounded-2xl font-heading font-bold text-coral-600 bg-white hover:bg-peach-50 border border-peach-200 shadow-soft transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 touch-target"
              >
                <RotateCcw className="w-4 h-4" />
                Replay Surprise
              </button>
            )}

            <div>
              <Link
                to="/create/birthday"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-coral-600 transition-colors py-1.5 touch-target"
              >
                <Gift className="w-3.5 h-3.5 text-coral-500" />
                Make one for someone you love →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
