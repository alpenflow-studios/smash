'use client';

import Link from 'next/link';
import { CreateSmashForm } from '@/components/create';
import { WalletConnect } from '@/components/wallet-connect';

export default function CreatePage() {
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
