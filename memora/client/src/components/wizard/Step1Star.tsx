import React, { useState } from 'react';
import { Sparkles, Calendar, Lock, User, Heart } from 'lucide-react';
import { useWizardStore } from '../../store/wizardStore.js';

export const Step1Star: React.FC = () => {
  const { draft, updateDraft, nextStep } = useWizardStore();

  const [recipientName, setRecipientName] = useState(draft.recipientName || '');
  const [senderName, setSenderName] = useState(draft.senderName || '');
  const [age, setAge] = useState<string>(draft.age ? String(draft.age) : '');
  const [birthdayDay, setBirthdayDay] = useState<string>(draft.birthdayDay ? String(draft.birthdayDay) : '');
  const [birthdayMonth, setBirthdayMonth] = useState<string>(draft.birthdayMonth ? String(draft.birthdayMonth) : '');
  const [lockUntilMidnight, setLockUntilMidnight] = useState(draft.lockUntilMidnight || false);
  const [error, setError] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError("Please enter the birthday star's name");
      return;
    }
    if (!senderName.trim()) {
      setError("Please enter your name so they know who it's from");
      return;
    }

    const numAge = age ? parseInt(age, 10) : undefined;
    if (numAge !== undefined && (isNaN(numAge) || numAge < 1 || numAge > 120)) {
      setError('Please enter a valid age between 1 and 120');
      return;
    }

    const numDay = birthdayDay ? parseInt(birthdayDay, 10) : undefined;
    const numMonth = birthdayMonth ? parseInt(birthdayMonth, 10) : undefined;

    setError(null);
    updateDraft({
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      age: numAge,
      birthdayDay: numDay,
      birthdayMonth: numMonth,
      lockUntilMidnight,
    });
    nextStep();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-peach-100">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-peach-100 mx-auto flex items-center justify-center text-coral-500 mb-3 shadow-inner">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-gray-900">
          Who's the birthday star?
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Tell us who we are celebrating and who this is from.
        </p>
      </div>

      <form onSubmit={handleContinue} className="space-y-4">
        {/* Recipient Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            Their Name <span className="text-coral-500">*</span>
          </label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="e.g. Aanya, Mom, Kabir, Sweetheart"
            maxLength={60}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white focus:ring-2 focus:ring-coral-500/20 outline-none text-gray-900 transition-all font-medium placeholder-gray-400"
          />
        </div>

        {/* Sender Name */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-coral-500" />
            Your Name <span className="text-coral-500">*</span>
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="e.g. Kabir, Your big sister, The Gang"
            maxLength={60}
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white focus:ring-2 focus:ring-coral-500/20 outline-none text-gray-900 transition-all font-medium placeholder-gray-400"
          />
        </div>

        {/* Age (Optional) */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Turning Age <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="number"
            min="1"
            max="120"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g. 24"
            className="w-full px-4 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white focus:ring-2 focus:ring-coral-500/20 outline-none text-gray-900 transition-all font-medium placeholder-gray-400"
          />
        </div>

        {/* Birthday Date (Optional) */}
        <div className="pt-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Birthday Date <span className="text-gray-400 font-normal lowercase">(optional)</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <select
              value={birthdayDay}
              onChange={(e) => setBirthdayDay(e.target.value)}
              className="w-full px-3 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white text-gray-800 text-sm outline-none font-medium"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={birthdayMonth}
              onChange={(e) => setBirthdayMonth(e.target.value)}
              className="w-full px-3 py-3 rounded-2xl bg-cream-50 border border-peach-200 focus:border-coral-500 focus:bg-white text-gray-800 text-sm outline-none font-medium"
            >
              <option value="">Month</option>
              {months.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lock until midnight toggle */}
        {birthdayDay && birthdayMonth && (
          <div className="p-3.5 rounded-2xl bg-peach-50 border border-peach-200/80 flex items-start gap-3 transition-all animate-fadeIn">
            <div className="pt-0.5">
              <input
                type="checkbox"
                id="lockMidnight"
                checked={lockUntilMidnight}
                onChange={(e) => setLockUntilMidnight(e.target.checked)}
                className="w-4 h-4 rounded text-coral-500 focus:ring-coral-500 border-peach-300"
              />
            </div>
            <label htmlFor="lockMidnight" className="text-xs text-gray-700 leading-snug cursor-pointer">
              <span className="font-semibold text-gray-900 flex items-center gap-1">
                <Lock className="w-3 h-3 text-coral-500" /> Lock until midnight on their birthday
              </span>
              If checked, opening the link early reveals a live countdown teaser until midnight!
            </label>
          </div>
        )}

        {error && (
          <p className="text-xs text-rose-500 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-200 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3.5 px-6 rounded-2xl font-heading font-semibold text-white bg-gradient-to-r from-coral-500 via-rose-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 shadow-floating hover:shadow-glow transition-all duration-300 transform active:scale-[0.98] text-base"
        >
          Continue to The Cake
        </button>
      </form>
    </div>
  );
};
