import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Share2, Sparkles, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuccessProps {
  slug: string;
  expiresAt: string;
  recipientName: string;
  onClose?: () => void;
}

export const SuccessShareModal: React.FC<SuccessProps> = ({
  slug,
  expiresAt,
  recipientName,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fullUrl = `${window.location.origin}/b/${slug}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, fullUrl, {
        width: 160,
        margin: 1.5,
        color: {
          dark: '#1F2937',
          light: '#FFFFFF',
        },
      });
    }
  }, [fullUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `Hey ${recipientName}! 🎂✨ I made something special just for you on your birthday. Open your surprise here: ${fullUrl}`
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const formattedExpiry = new Date(expiresAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-floating border border-peach-100 my-auto text-center animate-scaleUp">
        {/* Celebration icon */}
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3 shadow-inner">
          <Check className="w-8 h-8 stroke-[3]" />
        </div>

        <span className="text-xs uppercase tracking-widest text-emerald-600 font-extrabold bg-emerald-50 px-3 py-1 rounded-full">
          Payment Successful!
        </span>

        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
          {recipientName}'s link is live!
        </h2>
        <p className="text-xs text-gray-500 mt-1 mb-5">
          Share this private link with them anytime to experience their surprise.
        </p>

        {/* QR Code */}
        <div className="flex flex-col items-center justify-center p-4 bg-cream-50 rounded-2xl border border-peach-200/80 mb-5">
          <canvas ref={canvasRef} className="rounded-xl shadow-sm bg-white p-1" />
          <p className="text-[11px] text-gray-400 mt-2">
            Scan to open on mobile
          </p>
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 p-1.5 bg-cream-50 rounded-2xl border border-peach-200 mb-3">
          <input
            type="text"
            readOnly
            value={fullUrl}
            className="flex-1 px-3 py-1.5 bg-transparent text-xs text-gray-800 font-mono outline-none select-all"
          />
          <button
            type="button"
            onClick={handleCopy}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
              copied
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-coral-500 text-white hover:bg-coral-600'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-4">
          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share on WhatsApp
          </button>

          <Link
            to={`/b/${slug}`}
            className="w-full py-3 px-6 rounded-2xl font-heading font-semibold text-coral-600 bg-peach-50 hover:bg-peach-100 border border-peach-200 transition-all active:scale-95 flex items-center justify-center gap-1.5 text-xs block"
          >
            <span>Preview recipient view</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Expiry Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Active for 90 days until {formattedExpiry}</span>
        </div>
      </div>
    </div>
  );
};
