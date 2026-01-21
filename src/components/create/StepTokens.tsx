'use client';

import { useCreateSmash, type PaymentToken } from '@/store/use-create-smash';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const TOKEN_OPTIONS: { token: PaymentToken; name: string; icon: string; description: string }[] = [
  {
    token: 'ETH',
    name: 'Ethereum',
    icon: 'E',
    description: 'Native currency on Base',
  },
  {
    token: 'USDC',
    name: 'USD Coin',
    icon: '$',
    description: 'Stablecoin pegged to USD',
  },
];

export function StepTokens() {
  const {
    stakesType,
    acceptedTokens,
    entryFeeETH,
    entryFeeUSDC,
    toggleAcceptedToken,
    setEntryFeeETH,
    setEntryFeeUSDC,
    nextStep,
    prevStep,
  } = useCreateSmash();

  const isMonetary = stakesType === 'monetary';
  const isValid = !isMonetary || (acceptedTokens.length > 0 &&
    (acceptedTokens.includes('ETH') ? parseFloat(entryFeeETH) > 0 : true) &&
    (acceptedTokens.includes('USDC') ? parseFloat(entryFeeUSDC) > 0 : true));

  // Skip this step for non-monetary stakes
  if (!isMonetary) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Payment Tokens</h2>
          <p className="text-gray-400">
            This step is only required for smashes with monetary stakes.
          </p>
        </div>

        <Card className="border-gray-800 bg-gray-900/50 p-6 text-center">
          <p className="text-gray-400 mb-4">
            Your smash uses <span className="text-white font-medium">{stakesType}</span> stakes,
            so no payment is required from participants.
          </p>
        </Card>

        <div className="flex gap-4">
          <button
            onClick={prevStep}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 transition"
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="flex-1 py-3 px-4 rounded-lg font-semibold bg-purple-600 hover:bg-purple-700 transition"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Payment Tokens</h2>
        <p className="text-gray-400">
          Select which cryptocurrencies participants can use to pay the entry fee.
        </p>
      </div>

      {/* Token Selection */}
      <div className="space-y-3">
        <span className="text-sm font-medium text-gray-300">Accepted Tokens</span>
        <div className="grid grid-cols-2 gap-3">
          {TOKEN_OPTIONS.map(({ token, name, icon, description }) => {
            const isSelected = acceptedTokens.includes(token);
            return (
              <button
                key={token}
                type="button"
                onClick={() => toggleAcceptedToken(token)}
                className={cn(
                  'relative p-4 rounded-lg border-2 text-left transition-all',
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-600'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <Check size={16} className="text-purple-500" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-lg font-bold">
                    {icon}
                  </div>
                  <div>
                    <div className="font-semibold">{token}</div>
                    <div className="text-xs text-gray-400">{name}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500">{description}</p>
              </button>
            );
          })}
        </div>
        {acceptedTokens.length === 0 && (
          <p className="text-sm text-red-400">Select at least one token</p>
        )}
      </div>

      {/* Entry Fee Inputs */}
      {acceptedTokens.length > 0 && (
        <div className="space-y-4">
          <span className="text-sm font-medium text-gray-300">Entry Fee Amounts</span>
          <p className="text-sm text-gray-500">
            Set the entry fee for each accepted token. Participants will choose which token to pay with.
          </p>

          {acceptedTokens.includes('ETH') && (
            <div className="space-y-2">
              <span className="text-sm text-gray-400">ETH Entry Fee</span>
              <div className="relative">
                <Input
                  id="entryFeeETH"
                  type="number"
                  step="0.001"
                  min="0.001"
                  value={entryFeeETH}
                  onChange={(e) => setEntryFeeETH(e.target.value)}
                  className="pr-12 bg-gray-900 border-gray-700 text-white"
                  placeholder="0.01"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ETH
                </span>
              </div>
            </div>
          )}

          {acceptedTokens.includes('USDC') && (
            <div className="space-y-2">
              <span className="text-sm text-gray-400">USDC Entry Fee</span>
              <div className="relative">
                <Input
                  id="entryFeeUSDC"
                  type="number"
                  step="1"
                  min="1"
                  value={entryFeeUSDC}
                  onChange={(e) => setEntryFeeUSDC(e.target.value)}
                  className="pr-14 bg-gray-900 border-gray-700 text-white"
                  placeholder="10"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  USDC
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info Card */}
      <Card className="border-gray-800 bg-blue-900/20 p-4">
        <p className="text-sm text-blue-300">
          <strong>Note:</strong> All entry fees are held in a smart contract until the smash
          completes. Winners receive the prize pool automatically.
        </p>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={prevStep}
          className="flex-1 py-3 px-4 rounded-lg font-semibold bg-gray-800 hover:bg-gray-700 transition"
        >
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!isValid}
          className={cn(
            'flex-1 py-3 px-4 rounded-lg font-semibold transition',
            isValid
              ? 'bg-purple-600 hover:bg-purple-700'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          )}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
