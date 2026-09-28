import React, { useState, useRef, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { sound } from '../../utils/sound.js';
import { fireBurst } from '../../utils/confetti.js';

interface SceneProps {
  onComplete: () => void;
  recipientName: string;
}

export const Scene1Bow: React.FC<SceneProps> = ({ onComplete }) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullOffset, setPullOffset] = useState({ x: 0, y: 0 });
  const [isFlying, setIsFlying] = useState(false);
  const [arrowPos, setArrowPos] = useState({ x: 0, y: 0 });
  const [hitHeart, setHitHeart] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const startDragRef = useRef<{ x: number; y: number } | null>(null);

  const pullDistance = Math.min(
    Math.sqrt(pullOffset.x * pullOffset.x + pullOffset.y * pullOffset.y),
    80
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFlying || hitHeart) return;
    setIsPulling(true);
    startDragRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPulling || !startDragRef.current) return;
    const dx = e.clientX - startDragRef.current.x;
    // Only allow pulling downwards/backwards
    const dy = Math.max(0, e.clientY - startDragRef.current.y);
    setPullOffset({ x: dx * 0.4, y: dy * 0.6 });
  };

  const fireArrow = () => {
    if (isFlying || hitHeart) return;
    setIsPulling(false);
    setIsFlying(true);
    sound.playArrowShoot();

    // Animate arrow trajectory towards heart
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.08;
      if (progress >= 1) {
        clearInterval(interval);
        setHitHeart(true);
        sound.playHeartHit();
        fireBurst(0.5, 0.28);
        setTimeout(() => {
          onComplete();
        }, 1200);
      } else {
        setArrowPos({
          x: pullOffset.x * (1 - progress),
          y: -progress * 380,
        });
      }
    }, 16);
  };

  const handlePointerUp = () => {
    if (!isPulling) return;
    if (pullDistance > 20) {
      fireArrow();
    } else {
      setIsPulling(false);
      setPullOffset({ x: 0, y: 0 });
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        fireArrow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-12 px-6 select-none overflow-hidden touch-none"
    >
      {/* Top Header */}
      <div className="text-center z-10 animate-fadeIn">
        <span className="text-xs uppercase tracking-widest text-coral-500 font-bold bg-peach-100/60 px-3 py-1 rounded-full">
          For Your Eyes Only
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          a little something, for you
        </h2>
      </div>

      {/* Target Glowing Heart */}
      <div
        ref={heartRef}
        className={`relative z-10 transition-transform duration-300 ${
          hitHeart ? 'scale-150 animate-bounce' : 'scale-100'
        }`}
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-rose-400/30 rounded-full blur-xl animate-pulse" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-rose-500 to-coral-400 flex items-center justify-center text-white shadow-glow">
            <Heart className="w-12 h-12 fill-white animate-pulse" />
          </div>
        </div>
      </div>

      {/* Trajectory Guide line when pulling */}
      {isPulling && pullDistance > 15 && (
        <div
          className="absolute pointer-events-none z-10"
          style={{
            bottom: '180px',
            width: '2px',
            height: '240px',
            borderLeft: '2px dashed rgba(244, 63, 94, 0.4)',
            transform: `rotate(${pullOffset.x * -0.5}deg)`,
            transformOrigin: 'bottom center',
          }}
        />
      )}

      {/* Bow and Arrow Area */}
      <div className="relative flex flex-col items-center z-20">
        {/* Helper Hint */}
        <div className="mb-6 text-center">
          <p className="text-xs font-bold text-coral-600 tracking-wider uppercase bg-peach-100/80 px-4 py-1.5 rounded-full shadow-sm animate-bounce">
            🏹 PULL &amp; RELEASE
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            Drag back on the arrow, or tap below
          </p>
        </div>

        {/* Interactive Bow & Arrow Element */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-44 h-40 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
        >
          {/* Bow SVG */}
          <svg viewBox="0 0 160 100" className="w-40 h-24 overflow-visible pointer-events-none">
            {/* Bow curve */}
            <path
              d="M 20 80 Q 80 10 140 80"
              fill="none"
              stroke="#B45309"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Bowstring: dynamically bends when pulled */}
            <path
              d={`M 20 80 Q ${80 + pullOffset.x} ${80 + pullOffset.y} 140 80`}
              fill="none"
              stroke="#FDE68A"
              strokeWidth="2.5"
            />
          </svg>

          {/* Arrow */}
          <div
            className="absolute pointer-events-none transition-transform"
            style={{
              transform: isFlying
                ? `translate(${arrowPos.x}px, ${arrowPos.y}px)`
                : `translate(${pullOffset.x}px, ${pullOffset.y}px)`,
            }}
          >
            <div className="relative flex flex-col items-center">
              {/* Arrow Head */}
              <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[14px] border-b-coral-600" />
              {/* Arrow Shaft */}
              <div className="w-1.5 h-16 bg-gradient-to-b from-coral-500 to-amber-600 rounded-full" />
              {/* Feathers */}
              <div className="w-4 h-3 bg-amber-400 rounded-b-md" />
            </div>
          </div>
        </div>

        {/* Accessible Release button */}
        <button
          type="button"
          onClick={fireArrow}
          className="mt-2 text-xs font-semibold text-coral-600 hover:text-coral-700 bg-white px-4 py-2 rounded-xl border border-peach-200 shadow-sm active:scale-95 touch-target"
        >
          Tap to Shoot Arrow
        </button>
      </div>
    </div>
  );
};
