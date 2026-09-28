import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, ArrowLeft, Sparkles, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DraftData } from '../../types/index.js';
import { sound } from '../../utils/sound.js';
import { Scene1Bow } from './Scene1Bow.js';
import { Scene2Bloom } from './Scene2Bloom.js';
import { Scene3Cake } from './Scene3Cake.js';
import { Scene4Balloons } from './Scene4Balloons.js';
import { Scene5Memories } from './Scene5Memories.js';
import { Scene6Letter } from './Scene6Letter.js';
import { Scene7Finale } from './Scene7Finale.js';

interface ExperienceProps {
  mode: 'preview' | 'live';
  draft: DraftData;
  onOpenPaywall?: () => void;
}

export const Experience: React.FC<ExperienceProps> = ({ mode, draft, onOpenPaywall }) => {
  const navigate = useNavigate();
  // In live mode, start with a "Tap to open your surprise" splash screen for mobile autoplay policy compliance
  const [hasStarted, setHasStarted] = useState<boolean>(mode === 'preview');
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const recipient = draft.recipientName || 'Friend';
  const sender = draft.senderName || 'A friend';
  const hasPhotos = draft.photos && draft.photos.length > 0;

  useEffect(() => {
    if (hasStarted) {
      sound.startAmbientMusic();
    }
    return () => {
      sound.stopAmbientMusic();
    };
  }, [hasStarted]);

  const toggleSound = () => {
    const nextMuted = sound.toggleMute();
    setIsMuted(nextMuted);
  };

  const handleStartExperience = () => {
    setHasStarted(true);
    sound.setMuted(false);
    sound.startAmbientMusic();
    sound.playChime();
  };

  const advanceScene = () => {
    // If scene 4 is complete and there are no photos, skip Scene 5 (Memory Lane) straight to Scene 6
    if (currentScene === 4 && !hasPhotos) {
      setCurrentScene(6);
    } else if (currentScene < 7) {
      setCurrentScene((prev) => prev + 1);
    }
  };

  const handleReplay = () => {
    setCurrentScene(1);
    sound.playChime();
  };

  // Live Mode Splash Screen (for audio autoplay permissions)
  if (!hasStarted && mode === 'live') {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-peach-100 via-cream-50 to-rose-100 flex flex-col items-center justify-center p-6 select-none">
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-floating border border-peach-200/80 text-center space-y-5 animate-scaleUp">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-coral-500 via-rose-500 to-amber-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-coral-500/30 animate-pulseGlow">
            <Gift className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-coral-500 font-extrabold bg-peach-100 px-3 py-1 rounded-full">
              Surprise Waiting
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-gray-900 mt-2">
              For {recipient}
            </h1>
            <p className="text-xs text-gray-500">
              A private digital birthday experience created with love by {sender}.
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartExperience}
            className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-95 text-lg flex items-center justify-center gap-2 touch-target"
          >
            <Sparkles className="w-5 h-5" />
            Tap to open your surprise
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen max-w-md mx-auto bg-cream-50 overflow-hidden flex flex-col justify-between shadow-2xl">
      {/* Top Experience Controls Bar */}
      <header className="absolute top-0 inset-x-0 z-40 p-4 flex items-center justify-between pointer-events-none">
        {/* Left: Preview badge / Back Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {mode === 'preview' ? (
            <>
              <button
                type="button"
                onClick={() => navigate('/create/birthday')}
                className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-peach-200 text-xs font-semibold text-gray-700 flex items-center gap-1 hover:bg-white touch-target active:scale-95"
                aria-label="Back to wizard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-coral-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                Preview Mode
              </span>
            </>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-peach-200 text-[11px] font-semibold text-coral-600">
              LumiWish
            </div>
          )}
        </div>

        {/* Right: Scene indicator & Mute/Unmute Toggle */}
        <div className="pointer-events-auto flex items-center gap-2">
          <span className="text-[11px] font-semibold text-gray-500 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-peach-200">
            {currentScene}/7
          </span>
          <button
            type="button"
            onClick={toggleSound}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-peach-200 flex items-center justify-center text-gray-700 hover:text-coral-500 hover:bg-white transition-colors touch-target active:scale-95"
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-gray-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-coral-500" />
            )}
          </button>
        </div>
      </header>

      {/* Main Active Scene Render */}
      <main className="relative w-full h-full flex-1">
        {currentScene === 1 && (
          <Scene1Bow
            onComplete={advanceScene}
            recipientName={recipient}
          />
        )}
        {currentScene === 2 && (
          <Scene2Bloom
            onComplete={advanceScene}
            recipientName={recipient}
            age={draft.age}
          />
        )}
        {currentScene === 3 && (
          <Scene3Cake
            onComplete={advanceScene}
            cakeId={draft.cakeId || 'midnight_chocolate'}
            recipientName={recipient}
          />
        )}
        {currentScene === 4 && (
          <Scene4Balloons
            onComplete={advanceScene}
            balloons={draft.balloons || []}
            recipientName={recipient}
          />
        )}
        {currentScene === 5 && hasPhotos && (
          <Scene5Memories
            onComplete={advanceScene}
            photos={draft.photos}
            recipientName={recipient}
          />
        )}
        {currentScene === 6 && (
          <Scene6Letter
            onComplete={advanceScene}
            letter={draft.letter}
            recipientName={recipient}
            senderName={sender}
          />
        )}
        {currentScene === 7 && (
          <Scene7Finale
            mode={mode}
            recipientName={recipient}
            senderName={sender}
            onOpenPaywall={onOpenPaywall}
            onReplay={handleReplay}
          />
        )}
      </main>
    </div>
  );
};
