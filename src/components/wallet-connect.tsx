'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { User, LogOut, ChevronDown } from 'lucide-react';

export function WalletConnect() {
  const { ready, authenticated, login, logout, user } = usePrivy();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!ready) {
    return (
      <Button disabled className="bg-purple-600">
        Loading...
      </Button>
    );
  }

  if (authenticated && user?.wallet?.address) {
    const address = user.wallet.address;
    const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <div className="relative" ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="border-purple-500 text-purple-500 hover:bg-purple-500/10 flex items-center gap-2"
        >
          {shortAddress}
          <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </Button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg py-1 z-50">
            <Link
              href={`/profile/${address}`}
              className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 transition"
              onClick={() => setDropdownOpen(false)}
            >
              <User size={16} />
              My Profile
            </Link>
            <button
              onClick={() => {
                logout();
                setDropdownOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-800 transition text-left"
            >
              <LogOut size={16} />
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={login}
      className="bg-purple-600 hover:bg-purple-700"
    >
      Connect Wallet
    </Button>
  );
}