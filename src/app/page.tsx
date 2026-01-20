'use client';

import Link from 'next/link';
import { SmashCard } from '@/components/smash-card';
import { WalletConnect } from '@/components/wallet-connect';
import { mockSmashes } from '@/lib/mock-data';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
            smash.xyz
          </h1>
          <WalletConnect/>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4">
            smash anything
            <br />
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              prove everything
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Create competitive challenges with real stakes. Join smashes. Win together.
          </p>
          <Link 
            href="/create"
            className="inline-block px-8 py-4 bg-purple-600 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
          >
            Create Your First Smash
          </Link>
        </div>

        {/* Real Smash Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockSmashes.map((smash) => (
            <SmashCard
              key={smash.id}
              smash={smash}
              onJoin={() => console.log('Join:', smash.id)}
              onBet={() => console.log('Bet:', smash.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
