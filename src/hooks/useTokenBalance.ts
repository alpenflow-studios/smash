'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatUnits } from 'viem';
import { publicClient, getEthBalance } from '@/lib/blockchain/viem-client';
import { erc20Abi } from '@/lib/blockchain/contracts/erc20-abi';
import { SUPPORTED_TOKENS } from '@/lib/blockchain/config';

interface TokenBalance {
  symbol: string;
  balance: bigint;
  formatted: string;
  decimals: number;
}

interface UseTokenBalanceResult {
  balances: Record<string, TokenBalance>;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTokenBalance(address: `0x${string}` | undefined): UseTokenBalanceResult {
  const [balances, setBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newBalances: Record<string, TokenBalance> = {};

      // Fetch ETH balance
      const ethBalance = await getEthBalance(address);
      newBalances.ETH = {
        symbol: 'ETH',
        balance: ethBalance,
        formatted: formatUnits(ethBalance, 18),
        decimals: 18,
      };

      // Fetch USDC balance
      const usdcToken = SUPPORTED_TOKENS.USDC;
      if (usdcToken.address) {
        const usdcBalance = await publicClient.readContract({
          address: usdcToken.address,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        });

        newBalances.USDC = {
          symbol: 'USDC',
          balance: usdcBalance as bigint,
          formatted: formatUnits(usdcBalance as bigint, usdcToken.decimals),
          decimals: usdcToken.decimals,
        };
      }

      setBalances(newBalances);
    } catch (err) {
      console.error('Error fetching balances:', err);
      setError('Failed to fetch balances');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return {
    balances,
    isLoading,
    error,
    refetch: fetchBalances,
  };
}
