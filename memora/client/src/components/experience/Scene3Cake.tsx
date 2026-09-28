import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Mic, Wind } from 'lucide-react';
import { sound } from '../../utils/sound.js';
import { fireCannons } from '../../utils/confetti.js';

interface SceneProps {
  onComplete: () => void;
  cakeId: 'midnight_chocolate' | 'strawberry_blush' | 'vanilla_gold';
  recipientName: string;
}

export const Scene3Cake: React.FC<SceneProps> = ({ onComplete, cakeId, recipientName }) => {
  const [candleLit, setCandleLit] = useState<boolean>(true);
  const [isSliced, setIsSliced] = useState<boolean>(false);
  const [micActive, setMicActive] = useState<boolean>(false);
  const [wishMade, setWishMade] = useState<boolean>(false);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const cakeDetails = {
    midnight_chocolate: {
      name: 'Midnight Chocolate',
      frosting: '#3E2723',
      accents: '#FFD700',
      tagline: 'Rich cocoa & golden dust',
    },
    strawberry_blush: {
      name: 'Strawberry Blush',
      frosting: '#FB7185',
      accents: '#E11D48',
      tagline: 'Whipped berries & cream',
    },
    vanilla_gold: {
      name: 'Vanilla Gold',
      frosting: '#FBBF24',
      accents: '#D97706',
      tagline: 'Spun caramel & honey sponge',
    },
  }[cakeId] || {
    name: 'Celebration Cake',
    frosting: '#FB7185',
    accents: '#E11D48',
    tagline: 'Sweet celebration',
  };

  const blowOutCandle = () => {
    if (!candleLit) return;
    setCandleLit(false);
    setWishMade(true);
    sound.playCandleBlow();

    // Stop microphone if running
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    // Slice cake after brief moment
    setTimeout(() => {
      setIsSliced(true);
      fireCannons();
      sound.playChime();
    }, 800);

    setTimeout(() => {
      onComplete();
    }, 2800);
  };

  // Attempt microphone blow detection with graceful fallback
  const startMicDetection = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      audioStreamRef.current = stream;
      setMicActive(true);

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkBlow = () => {
        if (!candleLit) return;
        analyser.getByteFrequencyData(dataArray);

        // Low frequency energy (wind/blow produces high low-freq energy > 85)
        let lowFreqSum = 0;
        for (let i = 0; i < 10; i++) {
          lowFreqSum += dataArray[i];
        }
        const avg = lowFreqSum / 10;

        if (avg > 75) {
          blowOutCandle();
        } else {
          requestAnimationFrame(checkBlow);
        }
      };

      checkBlow();
    } catch {
      // Microphone access declined or unsupported - silent fallback
      setMicActive(false);
    }
  };

  useEffect(() => {
    startMicDetection();
    return () => {
      if (audioStreamRef.current) {
        audioStreamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-b from-plum-950 via-plum-900 to-black text-white flex flex-col items-center justify-between py-10 px-6 select-none overflow-hidden">
      {/* Background Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-sparkle"
            style={{
              width: `${Math.random() * 2.5 + 1}px`,
              height: `${Math.random() * 2.5 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Top Header */}
      <div className="relative z-10 text-center space-y-1">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-bold bg-white/10 px-3 py-1 rounded-full border border-white/10">
          First Things First
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold mt-2 text-white">
          Make a wish, {recipientName}
        </h2>
        <p className="text-xs text-purple-200">
          {candleLit ? 'Close your eyes, make a silent wish, and blow' : 'Your wish has been cast into the cosmos ✨'}
        </p>
      </div>

      {/* Interactive Birthday Cake */}
      <div className="relative z-10 my-auto flex flex-col items-center">
        {/* Glow halo behind cake */}
        <div
          className={`absolute -inset-10 rounded-full blur-3xl transition-opacity duration-700 ${
            candleLit ? 'bg-amber-500/20 opacity-100' : 'bg-transparent opacity-0'
          }`}
        />

        {/* Cake SVG Graphic */}
        <div
          onClick={blowOutCandle}
          className={`relative cursor-pointer transition-transform duration-500 ${
            isSliced ? 'scale-95' : 'hover:scale-105'
          }`}
        >
          <svg viewBox="0 0 240 220" className="w-64 h-64 overflow-visible drop-shadow-2xl">
            {/* Candle Stick */}
            <rect x="116" y="55" width="8" height="35" rx="4" fill="#F8FAFC" stroke="#E2E8F0" />
            {/* Candle Stripes */}
            <path d="M116 65 L124 60 M116 75 L124 70 M116 85 L124 80" stroke="#F43F5E" strokeWidth="2" />

            {/* Candle Flame (Flickering) */}
            {candleLit ? (
              <g className="animate-pulse">
                {/* Outer Flame */}
                <ellipse cx="120" cy="42" rx="7" ry="14" fill="#FF9E00" opacity="0.85" />
                {/* Inner Bright Flame */}
                <ellipse cx="120" cy="45" rx="3.5" ry="8" fill="#FFF" />
                {/* Glow ring */}
                <circle cx="120" cy="42" r="22" fill="#FFB703" opacity="0.2" className="animate-ping" />
              </g>
            ) : (
              /* Smoke Puff when blown */
              <g className="animate-fadeIn">
                <circle cx="120" cy="45" r="4" fill="#E2E8F0" opacity="0.6" />
                <circle cx="123" cy="38" r="6" fill="#E2E8F0" opacity="0.4" />
                <circle cx="118" cy="30" r="8" fill="#E2E8F0" opacity="0.2" />
              </g>
            )}

            {/* Top Tier */}
            <g>
              <rect
                x="65"
                y="90"
                width="110"
                height="45"
                rx="8"
                fill={cakeDetails.frosting}
                stroke="#1E1B4B"
                strokeWidth="1.5"
              />
              {/* Top Tier Frosting Drops */}
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx={75 + i * 22.5}
                  cy="93"
                  r="4.5"
                  fill={cakeDetails.accents}
                />
              ))}
            </g>

            {/* Bottom Tier */}
            <g>
              <rect
                x="35"
                y="135"
                width="170"
                height="60"
                rx="12"
                fill={cakeDetails.frosting}
                stroke="#1E1B4B"
                strokeWidth="1.5"
              />
              {/* Cream Ribbons */}
              <rect
                x="35"
                y="160"
                width="170"
                height="8"
                fill={cakeDetails.accents}
                opacity="0.9"
              />
            </g>

            {/* Cake Slice Animation cut line */}
            {isSliced && (
              <path
                d="M 120 90 L 150 195"
                stroke="#FFD700"
                strokeWidth="3"
                strokeDasharray="4 2"
                className="animate-pulse"
              />
            )}

            {/* Elegant Cake Stand / Plate */}
            <ellipse cx="120" cy="198" rx="100" ry="12" fill="#E2E8F0" opacity="0.9" />
            <ellipse cx="120" cy="195" rx="90" ry="8" fill="#CBD5E1" />
          </svg>
        </div>

        {/* Cake Name badge */}
        <div className="mt-2 text-center">
          <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-3 py-1 rounded-full">
            🎂 {cakeDetails.name}
          </span>
        </div>
      </div>

      {/* Blow or Tap Button & Controls */}
      <div className="relative z-10 text-center pb-4">
        {candleLit ? (
          <div className="space-y-2">
            <button
              type="button"
              onClick={blowOutCandle}
              className="py-3 px-6 rounded-2xl font-heading font-semibold text-gray-950 bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 shadow-glow transition-all duration-300 transform active:scale-95 flex items-center gap-2 mx-auto touch-target"
            >
              <Wind className="w-5 h-5 text-amber-900" />
              Tap to Blow Out Candle
            </button>
            <p className="text-[11px] text-purple-300 flex items-center justify-center gap-1">
              <Mic className="w-3.5 h-3.5 text-amber-400" />
              {micActive ? 'Microphone active: or blow into your phone mic!' : 'Or simply tap the button above'}
            </p>
          </div>
        ) : (
          <div className="text-center animate-fadeIn">
            <p className="text-sm font-semibold text-amber-300">
              ✨ Wish granted! Continuing the surprise...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
