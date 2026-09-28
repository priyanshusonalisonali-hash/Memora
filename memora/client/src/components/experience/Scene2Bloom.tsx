import React, { useEffect, useRef, useState } from 'react';
import { sound } from '../../utils/sound.js';

interface SceneProps {
  onComplete: () => void;
  recipientName: string;
  age?: number;
}

interface FloatingHeart {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  swing: number;
  color: string;
}

export const Scene2Bloom: React.FC<SceneProps> = ({ onComplete, recipientName, age }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [textStage, setTextStage] = useState<number>(0);
  const [showContinueHint, setShowContinueHint] = useState<boolean>(false);

  useEffect(() => {
    // Stage sequence
    const t1 = setTimeout(() => {
      setTextStage(1); // "it's officially your day"
      sound.playChime();
    }, 600);

    const t2 = setTimeout(() => {
      setTextStage(2); // "Happy Birthday, [Name]"
      sound.playChime();
    }, 2200);

    const t3 = setTimeout(() => {
      if (age) setTextStage(3); // "and just like that, you're turning [Age]"
      setShowContinueHint(true);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [age]);

  // Canvas animation for tree growth and blooming heart foliage
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 390);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    let bloomProgress = 0;
    const floatingHearts: FloatingHeart[] = [];
    const colors = ['#F43F5E', '#FB7185', '#FDA4AF', '#FF7144', '#FBBF24'];

    // Generate falling hearts
    for (let i = 0; i < 25; i++) {
      floatingHearts.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        size: 8 + Math.random() * 12,
        speed: 1 + Math.random() * 1.8,
        opacity: 0.3 + Math.random() * 0.7,
        swing: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const drawHeart = (cx: number, cy: number, size: number, color: string, opacity: number) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(cx, cy + topCurveHeight);
      // top left curve
      ctx.bezierCurveTo(cx, cy, cx - size / 2, cy, cx - size / 2, cy + topCurveHeight);
      // bottom left curve
      ctx.bezierCurveTo(
        cx - size / 2,
        cy + (size + topCurveHeight) / 2,
        cx,
        cy + (size + topCurveHeight) / 1.2,
        cx,
        cy + size
      );
      // bottom right curve
      ctx.bezierCurveTo(
        cx,
        cy + (size + topCurveHeight) / 1.2,
        cx + size / 2,
        cy + (size + topCurveHeight) / 2,
        cx + size / 2,
        cy + topCurveHeight
      );
      // top right curve
      ctx.bezierCurveTo(cx + size / 2, cy, cx, cy, cx, cy + topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (bloomProgress < 1) {
        bloomProgress += 0.012;
      }

      const trunkBaseX = width / 2;
      const trunkBaseY = height * 0.88;
      const trunkTopY = height * 0.58;

      // Draw Tree Trunk & main branches
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 10 * bloomProgress;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(trunkBaseX, trunkBaseY);
      ctx.quadraticCurveTo(trunkBaseX - 5, (trunkBaseY + trunkTopY) / 2, trunkBaseX, trunkTopY);
      ctx.stroke();

      // Side Branches
      if (bloomProgress > 0.3) {
        const branchProgress = Math.min(1, (bloomProgress - 0.3) / 0.7);
        ctx.lineWidth = 5 * branchProgress;

        // Left branch
        ctx.beginPath();
        ctx.moveTo(trunkBaseX, trunkTopY + 30);
        ctx.quadraticCurveTo(
          trunkBaseX - 40 * branchProgress,
          trunkTopY + 10,
          trunkBaseX - 65 * branchProgress,
          trunkTopY - 20 * branchProgress
        );
        ctx.stroke();

        // Right branch
        ctx.beginPath();
        ctx.moveTo(trunkBaseX, trunkTopY + 25);
        ctx.quadraticCurveTo(
          trunkBaseX + 40 * branchProgress,
          trunkTopY + 5,
          trunkBaseX + 70 * branchProgress,
          trunkTopY - 15 * branchProgress
        );
        ctx.stroke();
      }

      // Draw Heart-Shaped Foliage of small hearts
      if (bloomProgress > 0.5) {
        const foliageAlpha = Math.min(1, (bloomProgress - 0.5) / 0.5);
        const heartPositions = [
          { dx: 0, dy: -60, s: 18, c: '#F43F5E' },
          { dx: -35, dy: -70, s: 16, c: '#FB7185' },
          { dx: 35, dy: -70, s: 16, c: '#FB7185' },
          { dx: -65, dy: -50, s: 15, c: '#FDA4AF' },
          { dx: 65, dy: -50, s: 15, c: '#FDA4AF' },
          { dx: -80, dy: -20, s: 14, c: '#FF7144' },
          { dx: 80, dy: -20, s: 14, c: '#FF7144' },
          { dx: -45, dy: -15, s: 16, c: '#F43F5E' },
          { dx: 45, dy: -15, s: 16, c: '#F43F5E' },
          { dx: 0, dy: -25, s: 18, c: '#FBBF24' },
          { dx: -20, dy: 10, s: 13, c: '#FDA4AF' },
          { dx: 20, dy: 10, s: 13, c: '#FDA4AF' },
          { dx: 0, dy: 30, s: 12, c: '#F43F5E' },
        ];

        heartPositions.forEach((hp) => {
          drawHeart(
            trunkBaseX + hp.dx,
            trunkTopY + hp.dy,
            hp.s * foliageAlpha,
            hp.c,
            foliageAlpha * 0.95
          );
        });
      }

      // Draw falling hearts
      floatingHearts.forEach((fh) => {
        fh.y += fh.speed;
        fh.swing += 0.03;
        const currentX = fh.x + Math.sin(fh.swing) * 15;

        if (fh.y > height) {
          fh.y = -20;
          fh.x = Math.random() * width;
        }

        drawHeart(currentX, fh.y, fh.size, fh.color, fh.opacity);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      onClick={onComplete}
      className="relative w-full h-full min-h-[600px] flex flex-col items-center justify-between py-10 px-6 cursor-pointer select-none overflow-hidden"
    >
      {/* Canvas for Tree & Falling Hearts */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Atmospheric Text Overlays */}
      <div className="relative z-10 text-center max-w-sm mx-auto space-y-3 pt-6">
        {textStage >= 1 && (
          <p className="text-xs uppercase tracking-widest text-coral-500 font-bold bg-peach-100/70 px-4 py-1.5 rounded-full inline-block animate-fadeIn">
            it's officially your day
          </p>
        )}

        {textStage >= 2 && (
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight animate-fadeIn">
            Happy Birthday,{' '}
            <span className="bg-gradient-to-r from-coral-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {recipientName}
            </span>
          </h1>
        )}

        {textStage >= 3 && age && (
          <p className="font-heading text-lg font-medium text-gray-700 animate-fadeIn">
            and just like that, you're turning{' '}
            <span className="text-coral-500 font-bold">{age}</span> ✨
          </p>
        )}
      </div>

      {/* Tap anywhere to continue hint */}
      <div className="relative z-10 text-center pb-6">
        <p
          className={`text-xs text-coral-600 font-semibold bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-soft border border-peach-200 transition-opacity duration-500 ${
            showContinueHint ? 'opacity-100 animate-pulse' : 'opacity-0'
          }`}
        >
          Tap anywhere to continue →
        </p>
      </div>
    </div>
  );
};
