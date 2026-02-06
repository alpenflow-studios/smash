'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SmashCard } from '@/components/smash-card';
import { WalletConnect } from '@/components/wallet-connect';
import { getSmashes } from '@/lib/queries';
import { mockSmashes } from '@/lib/mock-data';
import type { Smash } from '@/types';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [smashes, setSmashes] = useState<Smash[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSmashes() {
      try {
        setLoading(true);
        setError(null);
        const data = await getSmashes({ limit: 12 });

        // If no data from Supabase, fall back to mock data
        if (data.length === 0) {
          setSmashes(mockSmashes);
        } else {
          setSmashes(data);
        }
      } catch (err) {
        console.error('Failed to fetch smashes:', err);
        setError('Failed to load smashes. Showing sample data.');
        setSmashes(mockSmashes);
      } finally {
        setLoading(false);
      }
    }

    fetchSmashes();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              smash.xyz
            </h1>
          </Link>
          <WalletConnect />
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-6xl font-bold mb-4">
            smash something
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

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            <span className="ml-3 text-gray-400">Loading smashes...</span>
          </div>
        ) : smashes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-4xl">🎯</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">No active smashes yet</h3>
            <p className="text-gray-400 mb-6">Be the first to create a challenge!</p>
            <Link
              href="/create"
              className="inline-block px-6 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Create a Smash
            </Link>
          </div>
        ) : (
          /* Smash Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {smashes.map((smash) => (
              <SmashCard
                key={smash.id}
                smash={smash}
                onJoin={() => router.push(`/smash/${smash.id}`)}
                onBet={() => router.push(`/smash/${smash.id}?tab=betting`)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
