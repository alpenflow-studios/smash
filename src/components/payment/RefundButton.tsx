'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { TransactionStatus } from './TransactionStatus';
import { cn } from '@/lib/utils';

interface RefundButtonProps {
  smashId: string;
  startsAt: Date;
  onSuccess: (txHash: string) => void;
  className?: string;
}

export function RefundButton({
  smashId,
  startsAt,
  onSuccess,
  className,
}: RefundButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { status, txHash, error, withdrawRefund, reset } = usePayment();

  const hasStarted = new Date() >= startsAt;

  const handleWithdraw = async () => {
    setShowModal(true);
    const hash = await withdrawRefund(smashId);
    if (hash) {
      onSuccess(hash);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    reset();
  };

  const handleRetry = () => {
    reset();
    handleWithdraw();
  };

  if (hasStarted) {
    return (
      <button
        disabled
        className={cn(
          'w-full py-2 px-4 rounded-lg text-sm font-medium',
          'bg-gray-800 text-gray-500 cursor-not-allowed',
          className
        )}
      >
        Refunds closed (smash started)
      </button>
    );
  }

  return (
    <>
      <button
        onClick={handleWithdraw}
        className={cn(
          'w-full py-2 px-4 rounded-lg text-sm font-medium transition',
          'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30',
          className
        )}
      >
        Withdraw & Refund
      </button>

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
