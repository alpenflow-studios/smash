'use client';

import { useState, useCallback } from 'react';
import { parseUnits, encodeFunctionData, type Hash } from 'viem';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { waitForTransaction } from '@/lib/blockchain/viem-client';
import { smashVaultAbi } from '@/lib/blockchain/contracts/smash-vault-abi';
import { erc20Abi } from '@/lib/blockchain/contracts/erc20-abi';
import { SMASH_VAULT_ADDRESS, SUPPORTED_TOKENS } from '@/lib/blockchain/config';

export type PaymentStatus = 'idle' | 'approving' | 'approved' | 'paying' | 'confirming' | 'success' | 'error';

interface UsePaymentResult {
  status: PaymentStatus;
  txHash: Hash | null;
  error: string | null;
  joinWithETH: (smashId: string, amount: string) => Promise<Hash | null>;
  approveUSDC: (amount: string) => Promise<Hash | null>;
  joinWithUSDC: (smashId: string, amount: string) => Promise<Hash | null>;
  withdrawRefund: (smashId: string) => Promise<Hash | null>;
  reset: () => void;
}

// UUID v4 regex pattern
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Convert UUID to bytes32
function uuidToBytes32(uuid: string): `0x${string}` {
  if (!UUID_REGEX.test(uuid)) {
    throw new Error(`Invalid UUID format: ${uuid}`);
  }
  const hex = uuid.replace(/-/g, '');
  return `0x${hex.padEnd(64, '0')}` as `0x${string}`;
}

export function usePayment(): UsePaymentResult {
  const { ready } = usePrivy();
  const { wallets } = useWallets();
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [txHash, setTxHash] = useState<Hash | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getWalletClient = useCallback(async () => {
    if (!ready || wallets.length === 0) {
      throw new Error('Wallet not connected');
    }

    const wallet = wallets[0];
    const provider = await wallet.getEthereumProvider();
    return { provider, address: wallet.address as `0x${string}` };
  }, [ready, wallets]);

  const reset = useCallback(() => {
    setStatus('idle');
    setTxHash(null);
    setError(null);
  }, []);

  const joinWithETH = useCallback(
    async (smashId: string, amount: string): Promise<Hash | null> => {
      if (!SMASH_VAULT_ADDRESS) {
        setError('Contract not configured');
        setStatus('error');
        return null;
      }

      try {
        setStatus('paying');
        setError(null);

        const { provider, address } = await getWalletClient();
        const smashIdBytes = uuidToBytes32(smashId);
        const valueWei = parseUnits(amount, 18);

        const data = encodeFunctionData({
          abi: smashVaultAbi,
          functionName: 'joinWithETH',
          args: [smashIdBytes],
        });

        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: SMASH_VAULT_ADDRESS,
            value: `0x${valueWei.toString(16)}`,
            data,
          }],
        }) as Hash;

        setTxHash(hash);
        setStatus('confirming');

        await waitForTransaction(hash);
        setStatus('success');
        return hash;
      } catch (err) {
        console.error('Join with ETH failed:', err);
        setError(err instanceof Error ? err.message : 'Transaction failed');
        setStatus('error');
        return null;
      }
    },
    [getWalletClient]
  );

  const approveUSDC = useCallback(
    async (amount: string): Promise<Hash | null> => {
      if (!SMASH_VAULT_ADDRESS) {
        setError('Contract not configured');
        setStatus('error');
        return null;
      }

      const usdcToken = SUPPORTED_TOKENS.USDC;
      if (!usdcToken.address) {
        setError('USDC address not configured');
        setStatus('error');
        return null;
      }

      try {
        setStatus('approving');
        setError(null);

        const { provider, address } = await getWalletClient();
        const amountUnits = parseUnits(amount, usdcToken.decimals);

        const data = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'approve',
          args: [SMASH_VAULT_ADDRESS, amountUnits],
        });

        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: usdcToken.address,
            data,
          }],
        }) as Hash;

        setTxHash(hash);
        await waitForTransaction(hash);
        setStatus('approved');
        return hash;
      } catch (err) {
        console.error('USDC approval failed:', err);
        setError(err instanceof Error ? err.message : 'Approval failed');
        setStatus('error');
        return null;
      }
    },
    [getWalletClient]
  );

  const joinWithUSDC = useCallback(
    async (smashId: string, amount: string): Promise<Hash | null> => {
      if (!SMASH_VAULT_ADDRESS) {
        setError('Contract not configured');
        setStatus('error');
        return null;
      }

      const usdcToken = SUPPORTED_TOKENS.USDC;

      try {
        setStatus('paying');
        setError(null);

        const { provider, address } = await getWalletClient();
        const smashIdBytes = uuidToBytes32(smashId);
        const amountUnits = parseUnits(amount, usdcToken.decimals);

        const data = encodeFunctionData({
          abi: smashVaultAbi,
          functionName: 'joinWithUSDC',
          args: [smashIdBytes, amountUnits],
        });

        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: SMASH_VAULT_ADDRESS,
            data,
          }],
        }) as Hash;

        setTxHash(hash);
        setStatus('confirming');

        await waitForTransaction(hash);
        setStatus('success');
        return hash;
      } catch (err) {
        console.error('Join with USDC failed:', err);
        setError(err instanceof Error ? err.message : 'Transaction failed');
        setStatus('error');
        return null;
      }
    },
    [getWalletClient]
  );

  const withdrawRefund = useCallback(
    async (smashId: string): Promise<Hash | null> => {
      if (!SMASH_VAULT_ADDRESS) {
        setError('Contract not configured');
        setStatus('error');
        return null;
      }

      try {
        setStatus('paying');
        setError(null);

        const { provider, address } = await getWalletClient();
        const smashIdBytes = uuidToBytes32(smashId);

        const data = encodeFunctionData({
          abi: smashVaultAbi,
          functionName: 'withdrawBeforeStart',
          args: [smashIdBytes],
        });

        const hash = await provider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: SMASH_VAULT_ADDRESS,
            data,
          }],
        }) as Hash;

        setTxHash(hash);
        setStatus('confirming');

        await waitForTransaction(hash);
        setStatus('success');
        return hash;
      } catch (err) {
        console.error('Withdraw refund failed:', err);
        setError(err instanceof Error ? err.message : 'Transaction failed');
        setStatus('error');
        return null;
      }
    },
    [getWalletClient]
  );

  return {
    status,
    txHash,
    error,
    joinWithETH,
    approveUSDC,
    joinWithUSDC,
    withdrawRefund,
    reset,
  };
}
