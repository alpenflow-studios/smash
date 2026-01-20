'use client';

import { useCreateSmash, VerificationMethod } from '@/store/use-create-smash';
import { Button } from '@/components/ui/button';

const verificationMethods: { 
  id: VerificationMethod; 
  label: string; 
  icon: string; 
  description: string;
  trustLevel: string;
}[] = [
  {
    id: 'wearable',
    label: 'Wearable Data',
    icon: '⌚',
    description: 'Automatic verification via fitness devices (Strava, Apple Health)',
    trustLevel: 'High',
  },
  {
    id: 'visual',
    label: 'Visual Proof',
    icon: '📸',
    description: 'Photo or video upload - pics or it didn\'t happen',
    trustLevel: 'Medium',
  },
  {
    id: 'participant',
    label: 'Participant Agreement',
    icon: '🤝',
    description: 'All participants vote on whether proof is valid',
    trustLevel: 'Variable',
  },
  {
    id: 'audience',
    label: 'Audience Voting',
    icon: '👥',
    description: 'Public viewers decide if proof is valid',
    trustLevel: 'Medium-High',
  },
  {
    id: 'hybrid',
    label: 'Hybrid (Escalation)',
    icon: '⚖️',
    description: 'Starts with participant vote, escalates to audience if disputed',
    trustLevel: 'High',
  },
];

const consensusOptions = [
  { value: 51, label: 'Majority (51%)' },
  { value: 67, label: 'Supermajority (67%)' },
  { value: 100, label: 'Unanimous (100%)' },
];

const disputeOptions = [
  { hours: 24, label: '24 hours' },
  { hours: 48, label: '48 hours' },
  { hours: 72, label: '72 hours' },
];

export function StepVerification() {
  const { 
    verificationMethod,
    consensusThreshold,
    disputeWindowHours,
    setVerificationMethod, 
    setConsensusThreshold,
    setDisputeWindowHours,
    nextStep,
    prevStep,
  } = useCreateSmash();

  const showConsensusOptions = ['participant', 'audience', 'hybrid'].includes(verificationMethod);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verification Method</h2>
        <p className="text-gray-400">How will completion be proven?</p>
      </div>

      {/* Verification Method */}
      <div className="space-y-3">
        {verificationMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setVerificationMethod(method.id)}
            className={`w-full p-4 rounded-lg border text-left transition-all ${
              verificationMethod === method.id
                ? 'border-purple-500 bg-purple-500/20'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{method.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{method.label}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    method.trustLevel === 'High' ? 'bg-green-500/20 text-green-400' :
                    method.trustLevel === 'Medium-High' ? 'bg-blue-500/20 text-blue-400' :
                    method.trustLevel === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {method.trustLevel} Trust
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1">{method.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Consensus Threshold (for voting methods) */}
      {showConsensusOptions && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-300">
            Consensus Required
          </label>
          <div className="grid grid-cols-3 gap-2">
            {consensusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setConsensusThreshold(option.value)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  consensusThreshold === option.value
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                <div className="font-medium">{option.value}%</div>
                <div className="text-xs text-gray-500">{option.label.split(' ')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dispute Window */}
      {showConsensusOptions && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-300">
            Dispute Window
          </label>
          <div className="grid grid-cols-3 gap-2">
            {disputeOptions.map((option) => (
              <button
                key={option.hours}
                onClick={() => setDisputeWindowHours(option.hours)}
                className={`p-3 rounded-lg border text-center transition-all ${
                  disputeWindowHours === option.hours
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">
            Time after verification when disputes can be raised
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
