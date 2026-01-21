'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { formatUnits } from 'viem';
import { cn } from '@/lib/utils';

export type TokenOption = 'ETH' | 'USDC';

interface TokenSelectorProps {
  selectedToken: TokenOption;
  onSelect: (token: TokenOption) => void;
  balances?: Record<string, { balance: bigint; decimals: number }>;
  acceptedTokens?: TokenOption[];
  disabled?: boolean;
}

const TOKEN_INFO: Record<TokenOption, { name: string; icon: string }> = {
  ETH: { name: 'Ethereum', icon: 'E' },
  USDC: { name: 'USD Coin', icon: '$' },
};

export function TokenSelector({
  selectedToken,
  onSelect,
  balances,
  acceptedTokens = ['ETH', 'USDC'],
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getBalance = (token: TokenOption): string => {
    if (!balances || !balances[token]) return '0';
    const { balance, decimals } = balances[token];
    const formatted = formatUnits(balance, decimals);
    return parseFloat(formatted).toFixed(token === 'USDC' ? 2 : 4);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          'flex items-center justify-between w-full px-4 py-3 rounded-lg border transition',
          'bg-gray-900 border-gray-700 text-white',
          disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-600 cursor-pointer'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
            {TOKEN_INFO[selectedToken].icon}
          </div>
          <div className="text-left">
            <div className="font-medium">{selectedToken}</div>
            <div className="text-xs text-gray-400">{TOKEN_INFO[selectedToken].name}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {balances && (
            <span className="text-sm text-gray-400">
              Balance: {getBalance(selectedToken)}
            </span>
          )}
          <ChevronDown
            size={20}
            className={cn('text-gray-400 transition-transform', isOpen && 'rotate-180')}
          />
        </div>
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 z-20 rounded-lg border border-gray-700 bg-gray-900 overflow-hidden shadow-lg">
            {acceptedTokens.map((token) => (
              <button
                key={token}
                type="button"
                onClick={() => {
                  onSelect(token);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex items-center justify-between w-full px-4 py-3 transition',
                  'hover:bg-gray-800',
                  token === selectedToken && 'bg-gray-800'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                    {TOKEN_INFO[token].icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{token}</div>
                    <div className="text-xs text-gray-400">{TOKEN_INFO[token].name}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {balances && (
                    <span className="text-sm text-gray-400">
                      {getBalance(token)}
                    </span>
                  )}
                  {token === selectedToken && (
                    <Check size={16} className="text-purple-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
