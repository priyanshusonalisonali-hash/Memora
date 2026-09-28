import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PhotoItem } from '../../types/index.js';
import { sound } from '../../utils/sound.js';

interface SceneProps {
  onComplete: () => void;
  photos: PhotoItem[];
  recipientName: string;
}

export const Scene5Memories: React.FC<SceneProps> = ({ onComplete, photos, recipientName }) => {
  // If there are no photos, automatically skip this scene
  useEffect(() => {
    if (!photos || photos.length === 0) {
      onComplete();
    }
  }, [photos, onComplete]);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  if (!photos || photos.length === 0) {
    return null;
  }

  const currentPhoto = photos[currentIndex];

  const handleNext = () => {
    sound.playChime();
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div
      onClick={handleNext}
      className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-10 px-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Fairy Lights across the top */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none flex justify-between px-4 z-20">
        <svg viewBox="0 0 400 40" className="w-full h-12 overflow-visible">
          {/* Wire */}
          <path d="M 0,10 Q 100,30 200,10 Q 300,30 400,10" fill="none" stroke="#78716C" strokeWidth="1.5" />
          {/* Fairy Light Bulbs with glowing halos */}
          {[40, 100, 160, 220, 280, 340].map((x, i) => (
            <g key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}>
              <circle cx={x} cy={16 + (i % 2 === 0 ? 4 : -2)} r="8" fill="#FBBF24" opacity="0.3" />
              <circle cx={x} cy={16 + (i % 2 === 0 ? 4 : -2)} r="4" fill="#FEF08A" />
            </g>
          ))}
        </svg>
      </div>

      {/* Top Header */}
      <div className="text-center z-10 pt-4 space-y-1">
        <span className="text-xs uppercase tracking-widest text-coral-500 font-bold bg-peach-100 px-3 py-1 rounded-full">
          Memory Lane
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          Cherished Moments
        </h2>
        <p className="text-xs text-gray-400">
          Photo {currentIndex + 1} of {photos.length} · Tap to flip through
        </p>
      </div>

      {/* Polaroid Card */}
      <div className="relative z-10 my-auto w-full max-w-[310px] transform hover:rotate-1 transition-all duration-300">
        {/* Wooden Clothes-peg Pin */}
        <div className="w-4 h-8 bg-amber-200/90 rounded-t-sm mx-auto shadow-sm -mb-4 z-20 relative border border-amber-300" />

        {/* Polaroid frame */}
        <div className="bg-white p-4 pb-6 rounded-2xl shadow-floating border border-peach-200/70 transition-transform animate-fadeIn">
          <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden bg-cream-100 flex items-center justify-center relative">
            <img
              src={currentPhoto.previewUrl || currentPhoto.url}
              alt={currentPhoto.caption || 'Celebration Memory'}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Caption in Handwriting Style */}
          <div className="mt-4 text-center min-h-[38px] flex items-center justify-center">
            <p className="font-handwriting text-2xl text-gray-800 leading-snug">
              {currentPhoto.caption || `Unforgettable day with ${recipientName}`}
            </p>
          </div>
        </div>
      </div>

      {/* Tap hint */}
      <div className="relative z-10 text-center pb-4">
        <span className="text-xs font-semibold text-coral-600 bg-white/90 px-4 py-2 rounded-full shadow-soft border border-peach-100 inline-flex items-center gap-1.5">
          <span>{currentIndex < photos.length - 1 ? 'Tap for next memory' : 'Tap to read your letter'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
