'use client';

import { useCreateSmash } from '@/store/use-create-smash';
import { StepBasics } from './StepBasics';
import { StepVisibility } from './StepVisibility';
import { StepParticipants } from './StepParticipants';
import { StepTimeline } from './StepTimeline';
import { StepVerification } from './StepVerification';
import { StepPrediction } from './StepPrediction';
import { StepReview } from './StepReview';

const steps = [
  { id: 1, label: 'Basics' },
  { id: 2, label: 'Visibility' },
  { id: 3, label: 'Participants' },
  { id: 4, label: 'Timeline' },
  { id: 5, label: 'Verification' },
  { id: 6, label: 'Betting' },
  { id: 7, label: 'Review' },
];

export function CreateSmashForm() {
  const { currentStep, setStep } = useCreateSmash();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasics />;
      case 2:
        return <StepVisibility />;
      case 3:
        return <StepParticipants />;
      case 4:
        return <StepTimeline />;
      case 5:
        return <StepVerification />;
      case 6:
        return <StepPrediction />;
      case 7:
        return <StepReview />;
      default:
        return <StepBasics />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Progress Bar */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-sm border-b border-gray-800 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          {/* Steps indicator */}
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => step.id < currentStep && setStep(step.id)}
                disabled={step.id > currentStep}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  step.id === currentStep
                    ? 'text-purple-400 font-medium'
                    : step.id < currentStep
                    ? 'text-gray-400 hover:text-gray-300 cursor-pointer'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                    step.id === currentStep
                      ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                      : step.id < currentStep
                      ? 'border-green-500 bg-green-500/20 text-green-400'
                      : 'border-gray-700 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </span>
                <span className="hidden md:inline">{step.label}</span>
              </button>
            ))}
          </div>
          
          {/* Progress bar */}
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
}
