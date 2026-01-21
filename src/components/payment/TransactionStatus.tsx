'use client';

import { Loader2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { getExplorerTxUrl } from '@/lib/blockchain/config';
import type { PaymentStatus } from '@/hooks/usePayment';

interface TransactionStatusProps {
  status: PaymentStatus;
  txHash: string | null;
  error: string | null;
  onRetry?: () => void;
  onClose?: () => void;
}

const STATUS_CONFIG: Record<PaymentStatus, { icon: React.ReactNode; title: string; description: string }> = {
  idle: {
    icon: null,
    title: '',
    description: '',
  },
  approving: {
    icon: <Loader2 className="w-8 h-8 animate-spin text-purple-500" />,
    title: 'Approving Token',
    description: 'Please confirm the approval in your wallet...',
  },
  approved: {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: 'Token Approved',
    description: 'Now confirming the payment...',
  },
  paying: {
    icon: <Loader2 className="w-8 h-8 animate-spin text-purple-500" />,
    title: 'Confirm Transaction',
    description: 'Please confirm the transaction in your wallet...',
  },
  confirming: {
    icon: <Loader2 className="w-8 h-8 animate-spin text-purple-500" />,
    title: 'Processing',
    description: 'Waiting for blockchain confirmation...',
  },
  success: {
    icon: <CheckCircle className="w-8 h-8 text-green-500" />,
    title: 'Success!',
    description: 'Your transaction has been confirmed.',
  },
  error: {
    icon: <XCircle className="w-8 h-8 text-red-500" />,
    title: 'Transaction Failed',
    description: 'Something went wrong. Please try again.',
  },
};

export function TransactionStatus({
  status,
  txHash,
  error,
  onRetry,
  onClose,
}: TransactionStatusProps) {
  if (status === 'idle') return null;

  const config = STATUS_CONFIG[status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">{config.icon}</div>
        <h3 className="text-xl font-bold mb-2">{config.title}</h3>
        <p className="text-gray-400 text-sm mb-4">
          {status === 'error' && error ? error : config.description}
        </p>

        {txHash && (
          <a
            href={getExplorerTxUrl(txHash)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm mb-4"
          >
            View on Explorer
            <ExternalLink size={14} />
          </a>
        )}

        <div className="flex gap-3 justify-center">
          {status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition"
            >
              Try Again
            </button>
          )}
          {(status === 'success' || status === 'error') && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition"
            >
              {status === 'success' ? 'Done' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
