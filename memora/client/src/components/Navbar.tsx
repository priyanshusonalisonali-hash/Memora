import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  showCreateBtn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showCreateBtn = false }) => {
  return (
    <header className="w-full bg-cream-50/80 backdrop-blur-md border-b border-peach-100 sticky top-0 z-30 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-coral-500 to-amber-400 flex items-center justify-center shadow-md shadow-coral-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight bg-gradient-to-r from-coral-600 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              LumiWish
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-peach-500 bg-peach-100/60 px-2 py-0.5 rounded-full">
              Birthday Magic
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {showCreateBtn && (
            <Link
              to="/create/birthday"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-peach-500 hover:from-rose-600 hover:to-peach-600 shadow-md shadow-coral-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Start a Surprise
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
