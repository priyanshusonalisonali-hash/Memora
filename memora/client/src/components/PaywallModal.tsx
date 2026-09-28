import React, { useState, useEffect } from 'react';
import { X, Sparkles, ShieldCheck, Clock, Check, Star, ArrowRight, Phone, Mail } from 'lucide-react';
import { TESTIMONIALS } from '../config/testimonials.js';
import { sound } from '../utils/sound.js';
import { fireCannons } from '../utils/confetti.js';
import { SuccessShareModal } from './SuccessShareModal.js';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  draftId?: string;
  recipientName: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  draftId,
  recipientName,
}) => {
  const [contact, setContact] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [testimonialIdx, setTestimonialIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number }>({
    minutes: 9,
    seconds: 59,
  });

  // Success state after payment verification
  const [successData, setSuccessData] = useState<{
    slug: string;
    expiresAt: string;
  } | null>(null);

  // 10-minute persisted countdown timer in localStorage per draft
  useEffect(() => {
    if (!isOpen || !draftId) return;

    const timerStorageKey = `lumiwish_timer_${draftId}`;
    let expiryTimestamp = localStorage.getItem(timerStorageKey);

    if (!expiryTimestamp) {
      const targetTime = Date.now() + 10 * 60 * 1000;
      localStorage.setItem(timerStorageKey, String(targetTime));
      expiryTimestamp = String(targetTime);
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, parseInt(expiryTimestamp!, 10) - Date.now());
      const m = Math.floor(remaining / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setTimeLeft({ minutes: m, seconds: s });
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, draftId]);

  // Testimonials rotation
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTestimonialIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!draftId) {
      setError('Draft ID missing. Please refresh and try again.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      // 1. Create order on server
      const orderRes = await fetch('/api/checkout/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ draftId, contact }),
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json();
        throw new Error(errJson.error || 'Failed to initialize order');
      }

      const orderData = await orderRes.json();

      // Check if real Razorpay or Mock Provider
      if (orderData.provider === 'mock' || !window.Razorpay) {
        // Direct test simulation verify
        const verifyRes = await fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftId,
            orderId: orderData.orderId,
            paymentId: `pay_test_${Date.now()}`,
            signature: 'test_signature_valid',
            contact,
          }),
        });

        if (verifyRes.ok) {
          const vData = await verifyRes.json();
          sound.playChime();
          fireCannons();
          setSuccessData({ slug: vData.slug, expiresAt: vData.expiresAt });
        } else {
          throw new Error('Verification failed in test mode');
        }
      } else {
        // Real Razorpay Checkout flow
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'LumiWish',
          description: `Birthday Surprise for ${recipientName}`,
          image: '/vite.svg',
          order_id: orderData.orderId,
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  draftId,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  contact,
                }),
              });

              if (verifyRes.ok) {
                const vData = await verifyRes.json();
                sound.playChime();
                fireCannons();
                setSuccessData({ slug: vData.slug, expiresAt: vData.expiresAt });
              } else {
                setError('Payment verification failed. Please contact support.');
              }
            } catch (err: any) {
              setError(err.message || 'Verification error');
            }
          },
          prefill: {
            contact: contact.includes('@') ? '' : contact,
            email: contact.includes('@') ? contact : '',
          },
          theme: {
            color: '#F43F5E',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  // If payment succeeded, show the Success share modal
  if (successData) {
    return (
      <SuccessShareModal
        slug={successData.slug}
        expiresAt={successData.expiresAt}
        recipientName={recipientName}
        onClose={onClose}
      />
    );
  }

  const currentTestimonial = TESTIMONIALS[testimonialIdx];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-floating border border-peach-100 my-auto animate-scaleUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-peach-50 transition-colors touch-target"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="text-center pt-2 mb-4">
          <span className="text-xs uppercase tracking-widest text-coral-600 font-extrabold bg-peach-100 px-3 py-1 rounded-full inline-block">
            Special Launch Offer
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {recipientName}'s birthday is ready
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            A private link, made only for {recipientName}
          </p>
        </div>

        {/* Pricing Card */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-peach-200/80 mb-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-400 line-through text-sm font-medium">₹499</span>
              <span className="font-heading text-3xl font-extrabold text-gray-900">₹199</span>
              <span className="text-xs font-bold text-coral-600 bg-rose-100 px-2 py-0.5 rounded-md">
                60% OFF
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">One-time fee · No subscription</p>
          </div>

          {/* Cosmetic 10-min countdown timer */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-coral-500 flex items-center gap-1 justify-end">
              <Clock className="w-3 h-3" /> Offer Ends
            </span>
            <span className="font-mono text-sm font-bold text-coral-600">
              {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="p-3.5 rounded-2xl bg-peach-50/50 border border-peach-100 mb-4 transition-all">
          <div className="flex items-center gap-2.5 mb-1.5">
            <img
              src={currentTestimonial.avatar}
              alt={currentTestimonial.name}
              className="w-7 h-7 rounded-full object-cover border border-peach-200"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-800">{currentTestimonial.name}</span>
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-[10px] text-gray-400 block">{currentTestimonial.relation}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 italic">"{currentTestimonial.comment}"</p>
          <div className="flex justify-center gap-1 mt-2">
            {TESTIMONIALS.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === testimonialIdx ? 'bg-coral-500 w-3' : 'bg-peach-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Contact Input (for link recovery) */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
            <Phone className="w-3 h-3 text-coral-500" />
            WhatsApp number or Email
            <span className="text-gray-400 font-normal text-[10px]">(for link recovery)</span>
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+91 98765 43210 or your@email.com"
            className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white text-xs outline-none text-gray-800 font-medium placeholder-gray-400"
          />
        </div>

        {/* Trust Badges */}
        <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 mb-4 text-center">
          <p className="text-[11px] text-gray-500 font-medium flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secure payment · Instant link · No ads · Stays live 90 days
          </p>
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center mb-3">
            {error}
          </p>
        )}

        {/* Unlock Button */}
        <button
          type="button"
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 px-6 rounded-2xl font-heading font-bold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-95 text-lg flex items-center justify-center gap-2 touch-target disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 animate-spin" /> Processing...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Unlock &amp; Get the Link <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
