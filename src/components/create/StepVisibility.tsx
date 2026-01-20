'use client';

import { useCreateSmash } from '@/store/use-create-smash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const visibilityOptions = [
  { 
    id: 'public', 
    label: '🌍 Public', 
    description: 'Anyone can view and join. Eligible for prediction markets.' 
  },
  { 
    id: 'private', 
    label: '🔒 Private', 
    description: 'Invite-only. No prediction markets.' 
  },
] as const;

const stakesOptions = [
  { 
    id: 'monetary', 
    label: '💰 Monetary', 
    description: 'Entry fee required. Winner takes the pool.' 
  },
  { 
    id: 'prize', 
    label: '🎁 Prize', 
    description: 'Physical or digital prize for the winner.' 
  },
  { 
    id: 'bragging', 
    label: '🏆 Bragging Rights', 
    description: 'No stakes, just glory and reputation.' 
  },
] as const;

export function StepVisibility() {
  const { 
    visibility,
    stakesType,
    entryFee,
    prizeDescription,
    setVisibility, 
    setStakesType,
    setEntryFee,
    setPrizeDescription,
    nextStep,
    prevStep,
  } = useCreateSmash();

  const isValid = 
    (stakesType === 'monetary' && entryFee > 0) ||
    (stakesType === 'prize' && prizeDescription.trim().length > 0) ||
    stakesType === 'bragging';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Visibility & Stakes</h2>
        <p className="text-gray-400">Who can join and what&apos;s on the line?</p>
      </div>

      {/* Visibility */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Visibility</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibilityOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setVisibility(option.id)}
              className={`p-4 rounded-lg border text-left transition-all ${
                visibility === option.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-lg">{option.label}</div>
              <div className="text-sm text-gray-500 mt-1">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Stakes Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">Stakes Type</label>
        <div className="space-y-3">
          {stakesOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setStakesType(option.id)}
              className={`w-full p-4 rounded-lg border text-left transition-all ${
                stakesType === option.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Entry Fee (if monetary) */}
      {stakesType === 'monetary' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-300">
            Entry Fee (USDC) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              min="1"
              value={entryFee}
              onChange={(e) => setEntryFee(Number(e.target.value))}
              className="pl-7 bg-gray-900 border-gray-700 text-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            Prize pool will be entry fee × number of participants
          </p>
        </div>
      )}

      {/* Prize Description (if prize) */}
      {stakesType === 'prize' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-300">
            Prize Description <span className="text-red-500">*</span>
          </label>
          <Input
            value={prizeDescription}
            onChange={(e) => setPrizeDescription(e.target.value)}
            placeholder="e.g., $100 Amazon gift card, Custom NFT, etc."
            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
          />
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
          disabled={!isValid}
          className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
