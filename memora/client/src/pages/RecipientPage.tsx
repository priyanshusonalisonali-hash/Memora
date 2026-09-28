import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, Clock, Sparkles, Heart, AlertCircle, Calendar } from 'lucide-react';
import { Experience } from '../components/experience/Experience.js';
import { DraftData } from '../types/index.js';

interface SurpriseResponse {
  isLocked: boolean;
  unlocksAt?: string;
  recipientName?: string;
  senderName?: string;
  message?: string;
  expired?: boolean;
  error?: string;
  surprise?: {
    slug: string;
    draftSnapshot: DraftData;
    views: number;
    firstOpenedAt: string;
    expiresAt: string;
  };
}

export const RecipientPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<SurpriseResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/public/surprises/${slug}`)
      .then(async (res) => {
        const json = await res.json();
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        setData({ isLocked: false, error: 'Could not load this surprise. Please check your internet connection.' });
        setLoading(false);
      });
  }, [slug]);

  // Live countdown timer if locked until midnight
  useEffect(() => {
    if (!data?.isLocked || !data.unlocksAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, new Date(data.unlocksAt!).getTime() - Date.now());
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });

      // When countdown reaches 0, reload to open
      if (remaining <= 0) {
        clearInterval(interval);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [data?.isLocked, data?.unlocksAt]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">
            Unwrapping surprise...
          </p>
        </div>
      </div>
    );
  }

  // Error / Expired / Not Found
  if (data?.error || data?.expired || !data) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-sm w-full bg-white rounded-3xl p-8 shadow-soft border border-peach-100 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-gray-900">
            {data?.expired ? 'Surprise Link Expired' : 'Surprise Not Found'}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {data?.error || 'This link may have expired or the URL might be mistyped. LumiWish links remain active for 90 days after purchase.'}
          </p>
          <Link
            to="/create/birthday"
            className="inline-block py-3 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 to-amber-500 shadow-md text-sm mt-2"
          >
            Create a New Surprise
          </Link>
        </div>
      </div>
    );
  }

  // Teaser Screen if locked until midnight
  if (data.isLocked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-peach-100 via-cream-50 to-rose-100 flex items-center justify-center p-6 select-none text-center">
        <div className="max-w-sm w-full bg-white rounded-3xl p-8 shadow-floating border border-peach-200/80 space-y-5 animate-scaleUp">
          <div className="w-16 h-16 rounded-3xl bg-peach-100 text-coral-500 mx-auto flex items-center justify-center shadow-inner animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest text-coral-500 font-extrabold bg-peach-100 px-3 py-1 rounded-full">
              Birthday Teaser
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-gray-900 mt-3">
              Shh... for {data.recipientName}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {data.senderName ? `${data.senderName} has planned something special.` : 'Someone special made this for you.'} It will automatically unlock at midnight!
            </p>
          </div>

          {/* Live Countdown Box */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-peach-200 flex items-center justify-center gap-3">
            <div className="text-center">
              <span className="block font-mono text-2xl font-bold text-gray-900">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Hours</span>
            </div>
            <span className="text-gray-300 font-mono text-xl font-bold">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl font-bold text-gray-900">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Mins</span>
            </div>
            <span className="text-gray-300 font-mono text-xl font-bold">:</span>
            <div className="text-center">
              <span className="block font-mono text-2xl font-bold text-coral-600">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Secs</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400 italic">
            Keep this link handy. The experience unlocks automatically when the clock strikes 12:00 AM!
          </p>
        </div>
      </div>
    );
  }

  // Active Experience in Live Mode
  if (data.surprise?.draftSnapshot) {
    return (
      <div className="w-full h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
        <Experience mode="live" draft={data.surprise.draftSnapshot} />
      </div>
    );
  }

  return null;
};
