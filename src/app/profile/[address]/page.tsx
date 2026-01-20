'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Target,
  Award,
  DollarSign,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  getUserByAddress,
  getSmashesByCreator,
  getSubmissionsByUser,
} from '@/lib/queries';
import type { User, Smash, SmashSubmission } from '@/types';
import { SmashCard } from '@/components/smash-card';

const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address || 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [createdSmashes, setCreatedSmashes] = useState<Smash[]>([]);
  const [submissions, setSubmissions] = useState<SmashSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        // Fetch user profile (or create placeholder if doesn't exist)
        const userData = await getUserByAddress(address);

        if (userData) {
          setUser(userData);
        } else {
          // Create a placeholder user object for addresses without a profile
          setUser({
            id: address,
            address: address,
            smashesCreated: 0,
            smashesJoined: 0,
            smashesWon: 0,
            totalWinnings: 0,
            reputationScore: 0,
            verifiedIdentity: false,
          });
        }

        // Fetch created smashes
        const smashes = await getSmashesByCreator(address);
        setCreatedSmashes(smashes);

        // Fetch submissions
        const subs = await getSubmissionsByUser(address);
        setSubmissions(subs);
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [address]);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              smash.xyz
            </h1>
          </div>
        </header>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="ml-3 text-gray-400">Loading profile...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-400 hover:text-white transition">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              smash.xyz
            </h1>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-400 mb-8">This address doesn&apos;t have any activity yet.</p>
          <Link href="/">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <ArrowLeft size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white transition">
            <ArrowLeft size={24} />
          </Link>
          <Link href="/">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              smash.xyz
            </h1>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-500 text-center">
            {error}
          </div>
        )}

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
          <Avatar className="w-24 h-24 border-4 border-purple-500/30">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-2xl">
              {address.slice(2, 4).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {user.username ? (
                <h1 className="text-3xl font-bold">{user.username}</h1>
              ) : (
                <h1 className="text-3xl font-bold">{shortenAddress(address)}</h1>
              )}
              {user.verifiedIdentity && (
                <Badge className="bg-blue-500/10 text-blue-500">Verified</Badge>
              )}
            </div>

            {/* Address with copy */}
            <div className="flex items-center gap-2 mb-4">
              <code className="text-sm text-gray-400 bg-gray-900 px-2 py-1 rounded">
                {shortenAddress(address)}
              </code>
              <button
                onClick={copyAddress}
                className="p-1 hover:bg-gray-800 rounded transition"
                title="Copy address"
              >
                {copied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} className="text-gray-400" />
                )}
              </button>
              <a
                href={`https://basescan.org/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-gray-800 rounded transition"
                title="View on BaseScan"
              >
                <ExternalLink size={16} className="text-gray-400" />
              </a>
            </div>

            {/* Reputation */}
            <div className="flex items-center gap-2">
              <Award size={18} className="text-yellow-500" />
              <span className="text-gray-400">Reputation:</span>
              <span className="font-semibold">{user.reputationScore}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Target size={16} />
              <span className="text-sm">Created</span>
            </div>
            <div className="text-2xl font-bold">{user.smashesCreated}</div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Calendar size={16} />
              <span className="text-sm">Joined</span>
            </div>
            <div className="text-2xl font-bold">{user.smashesJoined}</div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Trophy size={16} />
              <span className="text-sm">Won</span>
            </div>
            <div className="text-2xl font-bold text-green-500">{user.smashesWon}</div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <DollarSign size={16} />
              <span className="text-sm">Winnings</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${user.totalWinnings.toLocaleString()}
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="created" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start">
            <TabsTrigger value="created" className="data-[state=active]:bg-gray-800">
              Created ({createdSmashes.length})
            </TabsTrigger>
            <TabsTrigger value="participated" className="data-[state=active]:bg-gray-800">
              Participated ({submissions.length})
            </TabsTrigger>
          </TabsList>

          {/* Created Smashes Tab */}
          <TabsContent value="created" className="mt-6">
            {createdSmashes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {createdSmashes.map((smash) => (
                  <SmashCard key={smash.id} smash={smash} />
                ))}
              </div>
            ) : (
              <Card className="border-gray-800 bg-black/50 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Target size={32} className="text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">No smashes created yet</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    This user hasn&apos;t created any challenges.
                  </p>
                  <Link href="/create">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Create a Smash
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Participated Tab */}
          <TabsContent value="participated" className="mt-6">
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <Card key={submission.id} className="border-gray-800 bg-black/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/smash/${submission.smashId}`}
                          className="font-medium hover:text-purple-400 transition"
                        >
                          View Smash
                        </Link>
                        <p className="text-sm text-gray-400">
                          Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        className={
                          submission.verified
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-yellow-500/10 text-yellow-500'
                        }
                      >
                        {submission.verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-gray-800 bg-black/50 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Trophy size={32} className="text-gray-500" />
                  </div>
                  <h4 className="text-lg font-medium mb-2">No participations yet</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    This user hasn&apos;t joined any challenges.
                  </p>
                  <Link href="/">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Browse Smashes
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
