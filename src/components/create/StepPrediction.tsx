'use client';

import { useCreateSmash } from '@/store/use-create-smash';
import { Button } from '@/components/ui/button';

export function StepPrediction() {
  const { 
    visibility,
    bettingEnabled,
    setBettingEnabled, 
    nextStep,
    prevStep,
  } = useCreateSmash();

  const isPrivate = visibility === 'private';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Prediction Market</h2>
        <p className="text-gray-400">Let others bet on the outcome</p>
      </div>

      {isPrivate ? (
        // Private smashes can't have betting
        <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
          <div className="flex items-center gap-3 text-yellow-500 mb-3">
            <span className="text-2xl">⚠️</span>
            <span className="font-medium">Not Available</span>
          </div>
          <p className="text-gray-400">
            Prediction markets are only available for public smashes. 
            Change visibility to Public in Step 2 to enable betting.
          </p>
        </div>
      ) : (
        <>
          {/* Betting Toggle */}
          <div className="p-6 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-lg">Enable Prediction Market</div>
                <div className="text-sm text-gray-500 mt-1">
                  Allow spectators to bet on participants
                </div>
              </div>
              <button
                onClick={() => setBettingEnabled(!bettingEnabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  bettingEnabled ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    bettingEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Betting Info */}
          {bettingEnabled && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <h3 className="font-medium text-purple-400 mb-2">How it works</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Spectators can bet YES or NO on each participant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Betting closes when the smash starts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Winners are paid out after verification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Participants cannot bet on their own smash</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <div className="text-2xl mb-1">📈</div>
                  <div className="text-sm text-gray-400">Market-based odds</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Prices reflect crowd confidence
                  </div>
                </div>
                <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
                  <div className="text-2xl mb-1">🔒</div>
                  <div className="text-sm text-gray-400">On-chain escrow</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Funds secured by smart contract
                  </div>
                </div>
              </div>
            </div>
          )}

          {!bettingEnabled && (
            <div className="p-4 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">
                Without a prediction market, your smash will be a private competition 
                between participants only. No spectator betting allowed.
              </p>
            </div>
          )}
        </>
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
          Review Smash
        </Button>
      </div>
    </div>
  );
}
