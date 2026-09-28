import React, { useEffect } from 'react';
import { Navbar } from '../components/Navbar.js';
import { ProgressBar } from '../components/ProgressBar.js';
import { Step1Star } from '../components/wizard/Step1Star.js';
import { Step2Cake } from '../components/wizard/Step2Cake.js';
import { Step3Balloons } from '../components/wizard/Step3Balloons.js';
import { Step4Memories } from '../components/wizard/Step4Memories.js';
import { Step5Letter } from '../components/wizard/Step5Letter.js';
import { CraftingScreen } from '../components/CraftingScreen.js';
import { useWizardStore } from '../store/wizardStore.js';

export const CreateWizardPage: React.FC = () => {
  const { currentStep, isCrafting, initDraft } = useWizardStore();

  useEffect(() => {
    initDraft();
    // Record funnel event
    fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'page_view',
        sessionId: `sess_${Date.now()}`,
        meta: { path: '/create/birthday' },
      }),
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-50 via-peach-50/40 to-cream-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-4 sm:py-6 flex flex-col justify-center">
        <ProgressBar />

        <div className="mt-2 mb-6">
          {currentStep === 1 && <Step1Star />}
          {currentStep === 2 && <Step2Cake />}
          {currentStep === 3 && <Step3Balloons />}
          {currentStep === 4 && <Step4Memories />}
          {currentStep === 5 && <Step5Letter />}
        </div>
      </main>

      {/* Crafting animation modal */}
      {isCrafting && <CraftingScreen />}

      <footer className="w-full py-4 text-center text-xs text-gray-400">
        Draft saved automatically · Free full preview
      </footer>
    </div>
  );
};
