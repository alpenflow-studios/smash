'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CreateSmashForm } from '@/components/create';
import { WalletConnect } from '@/components/wallet-connect';
import { useCreateSmash } from '@/store/use-create-smash';

export default function CreatePage() {
  const reset = useCreateSmash((state) => state.reset);

  // Reset form state when navigating away from create page
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  return (
    <>
      {/* Header */}
      <header className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent"
          >
            smash.xyz
          </Link>
          <WalletConnect />
        </div>
      </header>

      {/* Create Form */}
      <CreateSmashForm />
    </>
  );
}
