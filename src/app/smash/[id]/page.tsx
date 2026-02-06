'use client';

import { use, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import {
  ArrowLeft,
  DollarSign,
  Users,
  Clock,
  Trophy,
  Camera,
  Check,
  X,
  Loader2,
  LogIn,
  Wallet,
} from 'lucide-react';
import { PaymentButton } from '@/components/payment/PaymentButton';
import { RefundButton } from '@/components/payment/RefundButton';
import type { TokenOption } from '@/components/payment/TokenSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  getSmashById,
  getSubmissionsForSmash,
  getParticipantsForSmash,
  joinSmashWithPayment,
  hasUserJoinedSmash,
  getAcceptedTokensForSmash,
  SmashParticipant,
  AcceptedToken,
} from '@/lib/queries';
import { mockSmashes } from '@/lib/mock-data';
import { Smash, SmashStatus, SmashSubmission } from '@/types';
import { ProofUploadDialog, ProofGallery } from '@/components/proof';

const getCategoryColor = (category: string) => {
  const colors = {
    fitness: 'bg-blue-500/10 text-blue-500',
    gaming: 'bg-green-500/10 text-green-500',
    creative: 'bg-pink-500/10 text-pink-500',
    social: 'bg-orange-500/10 text-orange-500',
    other: 'bg-purple-500/10 text-purple-500',
  };
  return colors[category as keyof typeof colors] || colors.other;
};

const getStatusColor = (status: SmashStatus) => {
  const colors = {
    draft: 'bg-gray-500/10 text-gray-500',
    open: 'bg-blue-500/10 text-blue-500',
    active: 'bg-green-500/10 text-green-500',
    verification: 'bg-yellow-500/10 text-yellow-500',
    complete: 'bg-purple-500/10 text-purple-500',
    disputed: 'bg-red-500/10 text-red-500',
  };
  return colors[status] || colors.draft;
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getTimeRemaining = (endsAt: Date) => {
  const now = new Date();
  const end = new Date(endsAt);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address || 'Unknown';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function SmashDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { authenticated, login, user } = usePrivy();

  const [smash, setSmash] = useState<Smash | null>(null);
  const [submissions, setSubmissions] = useState<SmashSubmission[]>([]);
  const [participants, setParticipants] = useState<SmashParticipant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [proofDialogOpen, setProofDialogOpen] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [acceptedTokensData, setAcceptedTokensData] = useState<AcceptedToken[]>([]);

  // Get current user's wallet address from Privy
  const currentUserId = user?.wallet?.address || '';

  const fetchSubmissions = useCallback(async () => {
    try {
      const data = await getSubmissionsForSmash(id);
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to fetch submissions:', err);
    }
  }, [id]);

  const fetchParticipants = useCallback(async () => {
    try {
      const data = await getParticipantsForSmash(id);
      setParticipants(data);
    } catch (err) {
      console.error('Failed to fetch participants:', err);
    }
  }, [id]);

  const checkIfJoined = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const joined = await hasUserJoinedSmash(id, currentUserId);
      setHasJoined(joined);
    } catch (err) {
      console.error('Failed to check participation:', err);
    }
  }, [id, currentUserId]);

  const fetchAcceptedTokens = useCallback(async () => {
    try {
      const tokens = await getAcceptedTokensForSmash(id);
      setAcceptedTokensData(tokens);
    } catch (err) {
      console.error('Failed to fetch accepted tokens:', err);
    }
  }, [id]);

  useEffect(() => {
    async function fetchSmash() {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from Supabase
        const data = await getSmashById(id);

        if (data) {
          setSmash(data);
        } else {
          // Fall back to mock data
          const mockSmash = mockSmashes.find((s) => s.id === id);
          if (mockSmash) {
            setSmash(mockSmash);
          } else {
            setSmash(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch smash:', err);
        setError('Failed to load smash details.');
        // Try mock data as fallback
        const mockSmash = mockSmashes.find((s) => s.id === id);
        if (mockSmash) {
          setSmash(mockSmash);
          setError('Using cached data.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchSmash();
    fetchSubmissions();
    fetchParticipants();
    fetchAcceptedTokens();
  }, [id, fetchSubmissions, fetchParticipants, fetchAcceptedTokens]);

  // Check if user has joined when they connect wallet
  useEffect(() => {
    if (currentUserId) {
      checkIfJoined();
    }
  }, [currentUserId, checkIfJoined]);

  const handlePaymentSuccess = async (txHash: string, token: TokenOption, amount: string) => {
    try {
      // Record the payment in the database
      await joinSmashWithPayment(id, currentUserId, txHash, token, amount);
      setHasJoined(true);
      setShowPayment(false);
      // Refresh participants list
      await fetchParticipants();
    } catch (err) {
      console.error('Failed to record payment:', err);
    }
  };

  const handleRefundSuccess = async (txHash: string) => {
    setHasJoined(false);
    await fetchParticipants();
  };

  // Derive accepted tokens from DB data, fallback to stakes type logic
  const acceptedTokens: TokenOption[] = acceptedTokensData.length > 0
    ? acceptedTokensData.map((t) => t.symbol)
    : smash?.stakesType === 'monetary' ? ['ETH', 'USDC'] : [];

  // Entry fee from smash record (stored in USDC equivalent)
  // For ETH, we use a rough conversion (could be improved with price oracle)
  const entryFeeUSDC = smash?.entryFee?.toString() || '0';
  const entryFeeETH = smash?.entryFee ? (smash.entryFee / 2500).toFixed(6) : '0'; // Rough USD/ETH conversion

  // Loading state
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
          <span className="ml-3 text-gray-400">Loading smash...</span>
        </div>
      </main>
    );
  }

  // Not found state
  if (!smash) {
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
          <h1 className="text-2xl font-bold mb-4">Smash Not Found</h1>
          <p className="text-gray-400 mb-8">The smash you&apos;re looking for doesn&apos;t exist.</p>
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

  // Use actual participants from DB, not from smash object
  const participantCount = participants.length;
  const spotsLeft = smash.maxParticipants - participantCount;
  const percentFilled = (participantCount / smash.maxParticipants) * 100;
  const isCreator = currentUserId && smash.creatorId && currentUserId.toLowerCase() === smash.creatorId.toLowerCase();
  const canJoin = smash.status === 'open' || smash.status === 'active';

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

        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={getCategoryColor(smash.category)}>{smash.category}</Badge>
            <Badge className={getStatusColor(smash.status)}>{smash.status}</Badge>
            {smash.bettingEnabled && (
              <Badge className="bg-yellow-500/10 text-yellow-500">betting enabled</Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold mb-4">{smash.title}</h1>
          <p className="text-lg text-gray-400">{smash.description}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <DollarSign size={16} />
              <span className="text-sm">Prize Pool</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              ${smash.prizePool.toLocaleString()}
            </div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <DollarSign size={16} />
              <span className="text-sm">Entry Fee</span>
            </div>
            <div className="text-2xl font-bold">${smash.entryFee}</div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Users size={16} />
              <span className="text-sm">Participants</span>
            </div>
            <div className="text-2xl font-bold">
              {participantCount}/{smash.maxParticipants}
            </div>
          </Card>

          <Card className="border-gray-800 bg-black/50 p-4">
            <div className="flex items-center gap-2 text-gray-400 mb-1">
              <Clock size={16} />
              <span className="text-sm">Time Left</span>
            </div>
            <div className="text-2xl font-bold">{getTimeRemaining(smash.endsAt)}</div>
          </Card>
        </div>

        {/* Join/Bet Section */}
        <Card className="border-gray-800 bg-black/50 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {hasJoined ? "You're In!" : isCreator ? 'Your Smash' : 'Join this Smash'}
              </h3>
              <p className="text-gray-400">
                {hasJoined
                  ? 'You have joined this challenge. Submit your proof to complete it!'
                  : isCreator
                  ? 'You created this smash. Share it to get participants!'
                  : spotsLeft > 0
                  ? `${spotsLeft} spots remaining`
                  : 'This smash is full'}
              </p>
            </div>
            <div className="flex gap-3">
              {hasJoined ? (
                <div className="flex flex-col gap-2">
                  <Button
                    className="bg-green-600 hover:bg-green-700 px-8 cursor-default"
                    disabled
                  >
                    <Check size={16} />
                    Joined
                  </Button>
                  {/* Show refund button if smash hasn't started */}
                  {smash.startsAt && new Date() < new Date(smash.startsAt) && (
                    <RefundButton
                      smashId={id}
                      startsAt={new Date(smash.startsAt)}
                      onSuccess={handleRefundSuccess}
                    />
                  )}
                </div>
              ) : isCreator ? (
                <Button
                  variant="outline"
                  className="border-purple-500 text-purple-500 px-8"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                  }}
                >
                  Copy Link
                </Button>
              ) : !authenticated ? (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                  onClick={login}
                >
                  <LogIn size={16} />
                  Connect to Join
                </Button>
              ) : showPayment ? (
                <div className="w-64">
                  <PaymentButton
                    smashId={id}
                    entryFeeETH={entryFeeETH}
                    entryFeeUSDC={entryFeeUSDC}
                    acceptedTokens={acceptedTokens}
                    onSuccess={handlePaymentSuccess}
                    onCancel={() => setShowPayment(false)}
                    disabled={spotsLeft === 0 || !canJoin}
                  />
                </div>
              ) : (
                <Button
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                  disabled={spotsLeft === 0 || !canJoin}
                  onClick={() => setShowPayment(true)}
                >
                  <Wallet size={16} />
                  Join for {smash.entryFee} {smash.stakesType === 'monetary' ? 'USDC' : ''}
                </Button>
              )}
              {smash.bettingEnabled && !showPayment && (
                <Button variant="outline" className="border-gray-700 hover:border-purple-500 px-8">
                  Place Bet
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                style={{ width: `${percentFilled}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800 w-full justify-start">
            <TabsTrigger value="details" className="data-[state=active]:bg-gray-800">
              Details
            </TabsTrigger>
            <TabsTrigger value="participants" className="data-[state=active]:bg-gray-800">
              Participants ({participantCount})
            </TabsTrigger>
            <TabsTrigger value="proofs" className="data-[state=active]:bg-gray-800">
              Proofs
            </TabsTrigger>
            {smash.bettingEnabled && (
              <TabsTrigger value="betting" className="data-[state=active]:bg-gray-800">
                Betting
              </TabsTrigger>
            )}
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-gray-800 bg-black/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Timeline</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium">Created</div>
                      <div className="text-sm text-gray-400">{formatDate(smash.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium">Starts</div>
                      <div className="text-sm text-gray-400">{formatDate(smash.startsAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                    <div>
                      <div className="font-medium">Ends</div>
                      <div className="text-sm text-gray-400">{formatDate(smash.endsAt)}</div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="border-gray-800 bg-black/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Verification</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Method</div>
                    <Badge className="bg-gray-800 text-gray-300">{smash.verificationMethod}</Badge>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Requirements</div>
                    {smash.proofRequirements.length > 0 ? (
                      <ul className="space-y-2">
                        {smash.proofRequirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <Check size={14} className="text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No specific requirements set</p>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Tags */}
            {smash.tags.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-gray-400 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {smash.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-700">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Participants Tab */}
          <TabsContent value="participants" className="mt-6">
            <Card className="border-gray-800 bg-black/50 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Participants</h3>
                <span className="text-sm text-gray-400">
                  {participantCount} of {smash.maxParticipants}
                </span>
              </div>

              <div className="space-y-3">
                {/* Creator */}
                {smash.creatorId && (
                  <Link
                    href={`/profile/${smash.creatorId}`}
                    className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-purple-600">
                          {smash.creatorId.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{shortenAddress(smash.creatorId)}</div>
                        <div className="text-xs text-purple-400">Creator</div>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/10 text-purple-500">organizer</Badge>
                  </Link>
                )}

                {/* Participants from database */}
                {participants.length > 0 ? (
                  <>
                    {participants.slice(0, 10).map((participant, i) => {
                      const isCurrentUser = currentUserId && participant.userId.toLowerCase() === currentUserId.toLowerCase();
                      return (
                        <Link
                          key={participant.id}
                          href={`/profile/${participant.userId}`}
                          className={`flex items-center justify-between p-3 rounded-lg transition ${
                            isCurrentUser
                              ? 'bg-green-900/20 border border-green-500/30 hover:border-green-500/50'
                              : 'bg-gray-900/50 hover:bg-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className={isCurrentUser ? 'bg-green-600' : 'bg-gray-700'}>
                                {participant.userId.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {shortenAddress(participant.userId)}
                                {isCurrentUser && <span className="ml-2 text-green-400 text-xs">(You)</span>}
                              </div>
                              <div className="text-xs text-gray-500">
                                Joined {new Date(participant.joinedAt).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              participant.status === 'completed'
                                ? 'bg-green-500/10 text-green-500'
                                : participant.status === 'failed'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-gray-500/10 text-gray-400'
                            }
                          >
                            {participant.status}
                          </Badge>
                        </Link>
                      );
                    })}

                    {participants.length > 10 && (
                      <div className="text-center text-gray-400 py-3">
                        + {participants.length - 10} more participants
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    No participants yet. Be the first to join!
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Proofs Tab */}
          <TabsContent value="proofs" className="mt-6">
            <Card className="border-gray-800 bg-black/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  Proof Submissions
                  {submissions.length > 0 && (
                    <span className="ml-2 text-sm text-gray-400">
                      ({submissions.length})
                    </span>
                  )}
                </h3>
                <Button
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => setProofDialogOpen(true)}
                >
                  <Camera size={16} />
                  Submit Proof
                </Button>
              </div>

              <ProofGallery submissions={submissions} />
            </Card>

            <ProofUploadDialog
              open={proofDialogOpen}
              onOpenChange={setProofDialogOpen}
              smashId={id}
              userId={currentUserId}
              onSuccess={fetchSubmissions}
            />
          </TabsContent>

          {/* Betting Tab */}
          {smash.bettingEnabled && (
            <TabsContent value="betting" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-gray-800 bg-black/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Place Your Bet</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Predict the outcome and win from the betting pool.
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-green-500 cursor-pointer transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check size={16} className="text-green-500" />
                          <span>Challenge Completed</span>
                        </div>
                        <span className="text-green-500 font-medium">1.5x</span>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500 cursor-pointer transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <X size={16} className="text-red-500" />
                          <span>Challenge Failed</span>
                        </div>
                        <span className="text-red-500 font-medium">2.5x</span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    Confirm Bet
                  </Button>
                </Card>

                <Card className="border-gray-800 bg-black/50 p-6">
                  <h3 className="text-lg font-semibold mb-4">Betting Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Bets</span>
                      <span className="font-medium">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bettors</span>
                      <span className="font-medium">23</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Completion Odds</span>
                      <span className="font-medium text-green-500">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Failure Odds</span>
                      <span className="font-medium text-red-500">35%</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </main>
  );
}
