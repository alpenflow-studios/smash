'use client';

import { useState, useCallback, useEffect } from 'react';
import { parseUnits } from 'viem';
import { Loader2 } from 'lucide-react';
import { usePrivy } from '@privy-io/react-auth';
import { usePayment, type PaymentStatus } from '@/hooks/usePayment';
import { useTokenBalance } from '@/hooks/useTokenBalance';
import { useAllowance } from '@/hooks/useAllowance';
import { TokenSelector, type TokenOption } from './TokenSelector';
import { TransactionStatus } from './TransactionStatus';
import { SUPPORTED_TOKENS } from '@/lib/blockchain/config';
import { cn } from '@/lib/utils';

interface PaymentButtonProps {
  smashId: string;
  entryFeeETH?: string;
  entryFeeUSDC?: string;
  acceptedTokens: TokenOption[];
  onSuccess: (txHash: string, token: TokenOption, amount: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

export function PaymentButton({
  smashId,
  entryFeeETH,
  entryFeeUSDC,
  acceptedTokens,
  onSuccess,
  onCancel,
  disabled = false,
  className,
}: PaymentButtonProps) {
  const { authenticated, login, user } = usePrivy();
  const walletAddress = user?.wallet?.address as `0x${string}` | undefined;

  const [selectedToken, setSelectedToken] = useState<TokenOption>(
    acceptedTokens.includes('ETH') ? 'ETH' : 'USDC'
  );
  const [showModal, setShowModal] = useState(false);

  const { balances, isLoading: balancesLoading } = useTokenBalance(walletAddress);
  const { allowance, needsApproval, refetch: refetchAllowance } = useAllowance(
    walletAddress,
    'USDC'
  );
  const {
    status,
    txHash,
    error,
    joinWithETH,
    approveUSDC,
    joinWithUSDC,
    reset,
  } = usePayment();

  const entryFee = selectedToken === 'ETH' ? entryFeeETH : entryFeeUSDC;
  const tokenInfo = SUPPORTED_TOKENS[selectedToken];

  // Check if user has enough balance
  const hasEnoughBalance = useCallback(() => {
    if (!balances[selectedToken] || !entryFee) return false;
    const required = parseUnits(entryFee, tokenInfo.decimals);
    return balances[selectedToken].balance >= required;
  }, [balances, selectedToken, entryFee, tokenInfo.decimals]);

  // Check if USDC needs approval
  const needsUSDCApproval = useCallback(() => {
    if (selectedToken !== 'USDC' || !entryFeeUSDC) return false;
    const required = parseUnits(entryFeeUSDC, 6);
    return needsApproval(required);
  }, [selectedToken, entryFeeUSDC, needsApproval]);

  // Handle payment
  const handlePayment = async () => {
    if (!entryFee) return;

    setShowModal(true);

    try {
      // If USDC and needs approval, approve first
      if (selectedToken === 'USDC' && needsUSDCApproval()) {
        const approvalHash = await approveUSDC(entryFee);
        if (!approvalHash) return;
        await refetchAllowance();
      }

      // Execute the join transaction
      let hash: string | null = null;
      if (selectedToken === 'ETH') {
        hash = await joinWithETH(smashId, entryFee);
      } else {
        hash = await joinWithUSDC(smashId, entryFee);
      }

      if (hash && entryFee) {
        onSuccess(hash, selectedToken, entryFee);
      }
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
    if (status === 'error' && onCancel) {
      onCancel();
    }
  };

  const handleRetry = () => {
    reset();
    handlePayment();
  };

  // Not authenticated
  if (!authenticated) {
    return (
      <button
        onClick={() => login()}
        className={cn(
          'w-full py-3 px-4 rounded-lg font-semibold transition',
          'bg-purple-600 hover:bg-purple-700 text-white',
          className
        )}
      >
        Connect Wallet to Join
      </button>
    );
  }

  // Loading balances
  if (balancesLoading) {
    return (
      <button
        disabled
        className={cn(
          'w-full py-3 px-4 rounded-lg font-semibold',
          'bg-gray-800 text-gray-400 cursor-not-allowed',
          className
        )}
      >
        <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
        Loading...
      </button>
    );
  }

  // Not enough balance
  if (!hasEnoughBalance()) {
    return (
      <div className="space-y-3">
        <TokenSelector
          selectedToken={selectedToken}
          onSelect={setSelectedToken}
          balances={balances}
          acceptedTokens={acceptedTokens}
        />
        <button
          disabled
          className={cn(
            'w-full py-3 px-4 rounded-lg font-semibold',
            'bg-gray-800 text-gray-400 cursor-not-allowed',
            className
          )}
        >
          Insufficient {selectedToken} Balance
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {acceptedTokens.length > 1 && (
          <TokenSelector
            selectedToken={selectedToken}
            onSelect={setSelectedToken}
            balances={balances}
            acceptedTokens={acceptedTokens}
            disabled={disabled}
          />
        )}
        <button
          onClick={handlePayment}
          disabled={disabled || !entryFee}
          className={cn(
            'w-full py-3 px-4 rounded-lg font-semibold transition',
            'bg-purple-600 hover:bg-purple-700 text-white',
            (disabled || !entryFee) && 'opacity-50 cursor-not-allowed',
            className
          )}
        >
          {needsUSDCApproval() ? (
            <>Approve & Join for {entryFee} {selectedToken}</>
          ) : (
            <>Join for {entryFee} {selectedToken}</>
          )}
        </button>
      </div>

      {showModal && (
        <TransactionStatus
          status={status}
          txHash={txHash}
          error={error}
          onRetry={handleRetry}
          onClose={handleClose}
        />
      )}
    </>
  );
}
