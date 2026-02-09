'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useCreateSmash } from '@/store/use-create-smash';
import { Button } from '@/components/ui/button';
import { apiUpload } from '@/lib/api-client';

// Generate a random invite code for private smashes
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function StepReview() {
  const router = useRouter();
  const { authenticated, login, user, getAccessToken } = usePrivy();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const state = useCreateSmash();
  const { prevStep, reset } = state;

  // Get creator wallet address from Privy
  const creatorId = user?.wallet?.address || '';

  const handleCreate = async () => {
    // Require wallet connection
    if (!authenticated || !creatorId) {
      login();
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate invite code for private smashes
      const inviteCode = state.visibility === 'private' ? generateInviteCode() : null;

      // Build the smash data payload
      const smashData = {
        title: state.title,
        description: state.description || null,
        category: state.category,
        status: 'open',
        entry_fee: state.stakesType === 'monetary' ? state.entryFee : null,
        prize_pool: state.stakesType === 'monetary' ? state.entryFee : 0,
        min_participants: state.minParticipants,
        max_participants: state.maxParticipants,
        starts_at: state.startsAt?.toISOString() || null,
        ends_at: state.endsAt?.toISOString() || null,
        verification_method: state.verificationMethod,
        betting_enabled: state.bettingEnabled && state.visibility === 'public',
        visibility: state.visibility,
        stakes_type: state.stakesType,
        invite_code: inviteCode,
        consensus_threshold: state.consensusThreshold,
        dispute_window_hours: state.disputeWindowHours,
      };

      // Create the smash via API route (handles auth + cover image upload server-side)
      const formData = new FormData();
      formData.append('data', JSON.stringify(smashData));
      if (state.coverImage) {
        formData.append('coverImage', state.coverImage);
      }
      const { id: newSmashId } = await apiUpload<{ id: string }>('/api/smashes', formData, getAccessToken);

      // Reset form and redirect
      reset();
      router.push(`/smash/${newSmashId}`);
    } catch (err) {
      console.error('Failed to create smash:', err);
      setError(err instanceof Error ? err.message : 'Failed to create smash');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getCategoryEmoji = (cat: string) => {
    const emojis: Record<string, string> = {
      fitness: '🏃',
      gaming: '🎮',
      creative: '🎨',
      social: '🤝',
      other: '✨',
    };
    return emojis[cat] || '✨';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review Your Smash</h2>
        <p className="text-gray-400">Make sure everything looks good</p>
      </div>

      {/* Preview Card */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {/* Cover Image */}
        {state.coverImagePreview ? (
          <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20">
            <img 
              src={state.coverImagePreview} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <span className="text-6xl">{getCategoryEmoji(state.category)}</span>
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* Title & Category */}
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <span className="px-2 py-0.5 bg-gray-800 rounded capitalize">
                {state.category}
              </span>
              <span className="px-2 py-0.5 bg-gray-800 rounded capitalize">
                {state.visibility}
              </span>
            </div>
            <h3 className="text-xl font-bold">{state.title || 'Untitled Smash'}</h3>
            {state.description && (
              <p className="text-gray-400 text-sm mt-2">{state.description}</p>
            )}
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Stakes</div>
              <div className="font-medium mt-1">
                {state.stakesType === 'monetary' && `$${state.entryFee} USDC`}
                {state.stakesType === 'prize' && (state.prizeDescription || 'Prize')}
                {state.stakesType === 'bragging' && '🏆 Bragging Rights'}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Participants</div>
              <div className="font-medium mt-1">
                {state.minParticipants}
                {state.maxParticipants ? ` - ${state.maxParticipants}` : '+'}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Starts</div>
              <div className="font-medium mt-1 text-sm">
                {formatDate(state.startsAt)}
              </div>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg">
              <div className="text-xs text-gray-500 uppercase">Ends</div>
              <div className="font-medium mt-1 text-sm">
                {formatDate(state.endsAt)}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="pt-4 border-t border-gray-800 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Verification</span>
              <span className="capitalize">{state.verificationMethod}</span>
            </div>
            {['participant', 'audience', 'hybrid'].includes(state.verificationMethod) && (
              <div className="flex justify-between">
                <span className="text-gray-500">Consensus Required</span>
                <span>{state.consensusThreshold}%</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Prediction Market</span>
              <span>{state.bettingEnabled && state.visibility === 'public' ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Wallet Connection Notice */}
      {!authenticated && (
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
          Connect your wallet to create this smash. Your wallet address will be recorded as the creator.
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          disabled={isSubmitting}
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={handleCreate}
          disabled={isSubmitting}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Creating...
            </span>
          ) : !authenticated ? (
            'Connect Wallet to Create'
          ) : (
            'Create Smash'
          )}
        </Button>
      </div>
    </div>
  );
}
