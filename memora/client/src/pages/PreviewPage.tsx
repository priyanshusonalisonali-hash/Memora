import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWizardStore } from '../store/wizardStore.js';
import { Experience } from '../components/experience/Experience.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { DraftData } from '../types/index.js';

export const PreviewPage: React.FC = () => {
  const { draftId } = useParams<{ draftId: string }>();
  const { draft: storeDraft } = useWizardStore();

  const [activeDraft, setActiveDraft] = useState<DraftData>(storeDraft);
  const [loading, setLoading] = useState<boolean>(!storeDraft.recipientName);
  const [showPaywall, setShowPaywall] = useState<boolean>(false);

  useEffect(() => {
    if (draftId && draftId !== 'current' && draftId !== storeDraft.id) {
      fetch(`/api/preview/${draftId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.surprise && data.surprise.draftSnapshot) {
            setActiveDraft(data.surprise.draftSnapshot);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Analytics
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'preview_completed',
        draftId: draftId || storeDraft.id,
        sessionId: `sess_${Date.now()}`,
      }),
    }).catch(() => {});
  }, [draftId, storeDraft]);

  const handleOpenPaywall = () => {
    setShowPaywall(true);
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'paywall_viewed',
        draftId: activeDraft.id || draftId,
        sessionId: `sess_${Date.now()}`,
      }),
    }).catch(() => {});
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-cream-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">
            Loading preview experience...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-neutral-900 flex items-center justify-center overflow-hidden">
      <Experience
        mode="preview"
        draft={activeDraft}
        onOpenPaywall={handleOpenPaywall}
      />

      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        draftId={activeDraft.id || draftId}
        recipientName={activeDraft.recipientName || 'them'}
      />
    </div>
  );
};
