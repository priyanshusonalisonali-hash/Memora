import React from 'react';
import { Sparkles, Heart, Gift, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.js';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-16 text-center">
        {/* Floating Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-peach-100 text-coral-600 text-xs font-bold shadow-sm mb-6 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Cinematic Digital Birthday Surprises</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight max-w-2xl mx-auto">
          Turn your birthday wish into an{' '}
          <span className="bg-gradient-to-r from-coral-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
            unforgettable experience
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mt-4 font-normal">
          No generic cards. Fill a 5-step guided wizard to bake a customized surprise with an interactive bow &amp; arrow, candle-blowing, floating balloons, and your heartfelt letter.
        </p>

        {/* CTA Button */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/create/birthday"
            className="w-full sm:w-auto py-4 px-8 rounded-2xl font-heading font-bold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-95 text-lg flex items-center justify-center gap-2"
          >
            <span>Create a Surprise for Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-3">
          Free full preview · No login or signup required · One-time ₹199 to unlock
        </p>

        {/* 3 Interactive Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 max-w-3xl mx-auto text-left">
          <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-coral-500 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-base mb-1">
              Cinematic &amp; Interactive
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Drag-to-shoot arrow, blossoming heart-tree, candle blow detection, and popping balloons.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-base mb-1">
              Midnight Countdown Lock
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Optionally lock the surprise until 00:00 on their birthday with a live teaser countdown.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-peach-100 shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-gray-900 text-base mb-1">
              Handwritten &amp; Personal
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Typewriter handwriting letter and photos swinging on fairy lights.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-peach-100 py-6 text-center text-xs text-gray-400">
        <p>© 2026 LumiWish · Made with love for birthdays that matter</p>
      </footer>
    </div>
  );
};
