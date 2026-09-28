import React from 'react';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useWizardStore } from '../store/wizardStore.js';

const STEP_NAMES = [
  'The Star',
  'The Cake',
  'The Balloons',
  'The Memories',
  'The Letter',
];

export const ProgressBar: React.FC = () => {
  const { currentStep, prevStep, setStep, isSaving } = useWizardStore();

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      {/* Top row: Back button, step label & autosave status */}
      <div className="flex items-center justify-between mb-3 text-sm">
        {currentStep > 1 ? (
          <button
            onClick={prevStep}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors p-1.5 -ml-1.5 rounded-lg hover:bg-peach-100/50 touch-target"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-xs">Back</span>
          </button>
        ) : (
          <div className="w-14" />
        )}

        <div className="text-center">
          <span className="font-heading font-semibold text-gray-800 text-sm">
            Step {currentStep} of 5
          </span>
          <span className="text-gray-400 mx-1.5">·</span>
          <span className="text-coral-500 font-medium text-xs">
            {STEP_NAMES[currentStep - 1]}
          </span>
        </div>

        <div className="w-14 flex justify-end">
          {isSaving ? (
            <span className="text-[11px] text-peach-500 flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" />
              Saving...
            </span>
          ) : (
            <span className="text-[11px] text-gray-400 font-normal">
              Autosaved
            </span>
          )}
        </div>
      </div>

      {/* 5 Progress Dots / Indicator Bar */}
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <button
              key={step}
              onClick={() => isCompleted && setStep(step)}
              disabled={!isCompleted}
              aria-label={`Go to step ${step}`}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isCompleted
                  ? 'bg-gradient-to-r from-coral-500 to-amber-400 cursor-pointer'
                  : isCurrent
                  ? 'bg-coral-500 shadow-sm shadow-coral-500/30'
                  : 'bg-peach-100 cursor-not-allowed'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
