'use client';

import { useState } from 'react';
import { useCreateSmash } from '@/store/use-create-smash';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function StepParticipants() {
  const { 
    minParticipants,
    maxParticipants,
    inviteList,
    visibility,
    setMinParticipants, 
    setMaxParticipants,
    addToInviteList,
    removeFromInviteList,
    nextStep,
    prevStep,
  } = useCreateSmash();

  const [inviteInput, setInviteInput] = useState('');
  const [hasMaxLimit, setHasMaxLimit] = useState(maxParticipants !== null);

  const handleAddInvite = () => {
    const trimmed = inviteInput.trim();
    // Basic validation for wallet address (starts with 0x and has 42 chars)
    if (trimmed && trimmed.startsWith('0x') && trimmed.length === 42) {
      if (!inviteList.includes(trimmed)) {
        addToInviteList(trimmed);
      }
      setInviteInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInvite();
    }
  };

  const toggleMaxLimit = () => {
    if (hasMaxLimit) {
      setMaxParticipants(null);
    } else {
      setMaxParticipants(10);
    }
    setHasMaxLimit(!hasMaxLimit);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Participants</h2>
        <p className="text-gray-400">Set limits for who can join</p>
      </div>

      {/* Min Participants */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          Minimum Participants
        </label>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMinParticipants(Math.max(2, minParticipants - 1))}
            className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition"
          >
            -
          </button>
          <span className="text-2xl font-bold w-12 text-center">{minParticipants}</span>
          <button
            onClick={() => setMinParticipants(minParticipants + 1)}
            className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition"
          >
            +
          </button>
        </div>
        <p className="text-xs text-gray-500">At least 2 participants required</p>
      </div>

      {/* Max Participants Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            Maximum Participants
          </label>
          <button
            onClick={toggleMaxLimit}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              hasMaxLimit ? 'bg-purple-600' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                hasMaxLimit ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {hasMaxLimit && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
            <button
              onClick={() => setMaxParticipants(Math.max(minParticipants, (maxParticipants || 10) - 1))}
              className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition"
            >
              -
            </button>
            <span className="text-2xl font-bold w-12 text-center">{maxParticipants}</span>
            <button
              onClick={() => setMaxParticipants((maxParticipants || 10) + 1)}
              className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center hover:bg-gray-700 transition"
            >
              +
            </button>
          </div>
        )}
        {!hasMaxLimit && (
          <p className="text-xs text-gray-500">Unlimited participants allowed</p>
        )}
      </div>

      {/* Invite List (for private smashes) */}
      {visibility === 'private' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <label className="text-sm font-medium text-gray-300">
            Invite List (Wallet Addresses)
          </label>
          <div className="flex gap-2">
            <Input
              value={inviteInput}
              onChange={(e) => setInviteInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="0x..."
              className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 font-mono text-sm"
            />
            <Button
              onClick={handleAddInvite}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              Add
            </Button>
          </div>
          
          {inviteList.length > 0 && (
            <div className="space-y-2 mt-3">
              {inviteList.map((address) => (
                <div
                  key={address}
                  className="flex items-center justify-between p-2 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <span className="font-mono text-sm text-gray-400">
                    {address.slice(0, 6)}...{address.slice(-4)}
                  </span>
                  <button
                    onClick={() => removeFromInviteList(address)}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-xs text-gray-500">
            Only these wallets can join. You can also share an invite link later.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={prevStep}
          variant="outline"
          className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          Back
        </Button>
        <Button
          onClick={nextStep}
          className="flex-1 bg-purple-600 hover:bg-purple-700"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
