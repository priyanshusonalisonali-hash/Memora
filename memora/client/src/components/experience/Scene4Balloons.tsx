import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { sound } from '../../utils/sound.js';
import { fireBurst } from '../../utils/confetti.js';

interface SceneProps {
  onComplete: () => void;
  balloons: string[];
  recipientName: string;
}

const BALLOON_COLORS = [
  { bg: '#F43F5E', highlight: '#FB7185', string: '#FDA4AF' },
  { bg: '#FF7144', highlight: '#FF946E', string: '#FFD3BE' },
  { bg: '#F59E0B', highlight: '#FBBF24', string: '#FEF3C7' },
  { bg: '#8B5CF6', highlight: '#A78BFA', string: '#EDE9FE' },
  { bg: '#EC4899', highlight: '#F472B6', string: '#FCE7F3' },
];

export const Scene4Balloons: React.FC<SceneProps> = ({ onComplete, balloons, recipientName }) => {
  const [poppedIndices, setPoppedIndices] = useState<number[]>([]);
  const [activeMessage, setActiveMessage] = useState<{ index: number; text: string } | null>(null);

  const total = balloons.length;

  const handlePop = (index: number) => {
    if (poppedIndices.includes(index)) return;

    sound.playBalloonPop();
    fireBurst(0.5, 0.5);

    const updated = [...poppedIndices, index];
    setPoppedIndices(updated);
    setActiveMessage({ index, text: balloons[index] });
  };

  const closeMessage = () => {
    setActiveMessage(null);
    if (poppedIndices.length === total) {
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden">
      {/* Top Header */}
      <div className="text-center z-10 space-y-1">
        <span className="text-xs uppercase tracking-widest text-coral-500 font-bold bg-peach-100 px-3 py-1 rounded-full">
          Pop To Reveal
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          Pop the balloons!
        </h2>
        <p className="text-xs text-gray-500">
          Tap each balloon to reveal why you are loved ({poppedIndices.length}/{total} popped)
        </p>
      </div>

      {/* Floating Balloons Cluster */}
      <div className="relative w-full max-w-sm h-80 my-auto flex items-center justify-center">
        {balloons.map((_, idx) => {
          const isPopped = poppedIndices.includes(idx);
          const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];

          // Distribute balloons visually
          const positions = [
            { x: -50, y: -25, delay: '0s' },
            { x: 45, y: -40, delay: '1s' },
            { x: 0, y: 15, delay: '0.5s' },
            { x: -65, y: 50, delay: '1.5s' },
            { x: 55, y: 45, delay: '2s' },
          ];
          const pos = positions[idx % positions.length];

          if (isPopped) return null;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handlePop(idx)}
              aria-label={`Pop balloon ${idx + 1}`}
              className="absolute group transition-transform active:scale-95 animate-float cursor-pointer"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px)`,
                animationDelay: pos.delay,
              }}
            >
              <svg viewBox="0 0 100 140" className="w-24 h-32 drop-shadow-lg filter group-hover:scale-110 transition-transform">
                {/* Balloon Body */}
                <ellipse cx="50" cy="50" rx="38" ry="46" fill={color.bg} />
                {/* Light Reflection / Highlight */}
                <ellipse cx="38" cy="32" rx="10" ry="16" fill={color.highlight} opacity="0.6" />
                {/* Balloon Knot */}
                <polygon points="46,95 54,95 50,102" fill={color.bg} />
                {/* String */}
                <path
                  d="M50,102 Q42,118 52,135"
                  fill="none"
                  stroke="#CBD5E1"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          );
        })}

        {/* If all balloons are popped */}
        {poppedIndices.length === total && !activeMessage && (
          <div className="text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600 mb-2">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>
            <p className="font-heading font-bold text-lg text-gray-900">
              All reasons revealed!
            </p>
            <p className="text-xs text-coral-600 font-medium mt-1">
              Heading to the memory lane...
            </p>
          </div>
        )}
      </div>

      {/* Pop-up Message Card when a balloon is tapped */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-floating border border-peach-100 text-center animate-scaleUp">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-500 bg-peach-100/80 px-3 py-1 rounded-full">
              Reason {activeMessage.index + 1} of {total}
            </span>

            <h3 className="font-heading text-xl sm:text-2xl font-bold text-gray-900 mt-4 mb-3 leading-snug">
              "{activeMessage.text}"
            </h3>

            <p className="text-xs text-gray-400 mb-6">
              Just one of the countless reasons why {recipientName} is cherished.
            </p>

            <button
              type="button"
              onClick={closeMessage}
              className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating flex items-center justify-center gap-2 active:scale-95 transition-all text-base"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="text-center pb-4 text-xs text-gray-400">
        Tap balloons to pop them
      </div>
    </div>
  );
};
