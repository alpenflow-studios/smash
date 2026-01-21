'use client';

import { useState, useEffect, useCallback } from 'react';
import { publicClient } from '@/lib/blockchain/viem-client';
import { erc20Abi } from '@/lib/blockchain/contracts/erc20-abi';
import { SMASH_VAULT_ADDRESS, SUPPORTED_TOKENS } from '@/lib/blockchain/config';

interface UseAllowanceResult {
  allowance: bigint;
  isLoading: boolean;
  error: string | null;
  needsApproval: (amount: bigint) => boolean;
  refetch: () => Promise<void>;
}

export function useAllowance(
  ownerAddress: `0x${string}` | undefined,
  tokenSymbol: 'USDC'
): UseAllowanceResult {
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllowance = useCallback(async () => {
    if (!ownerAddress || !SMASH_VAULT_ADDRESS) {
      setAllowance(BigInt(0));
      return;
    }

    const token = SUPPORTED_TOKENS[tokenSymbol];
    if (!token.address) {
      setAllowance(BigInt(0));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await publicClient.readContract({
        address: token.address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [ownerAddress, SMASH_VAULT_ADDRESS],
      });

      setAllowance(result as bigint);
    } catch (err) {
      console.error('Error fetching allowance:', err);
      setError('Failed to fetch allowance');
    } finally {
      setIsLoading(false);
    }
  }, [ownerAddress, tokenSymbol]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  const needsApproval = useCallback(
    (amount: bigint): boolean => {
      return allowance < amount;
    },
    [allowance]
  );

  return {
    allowance,
    isLoading,
    error,
    needsApproval,
    refetch: fetchAllowance,
  };
}
