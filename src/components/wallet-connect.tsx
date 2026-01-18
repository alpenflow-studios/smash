'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';

export function WalletConnect() {
  const { ready, authenticated, login, logout, user } = usePrivy();

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
      <Button 
        variant="outline" 
        onClick={logout}
        className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
      >
        {shortAddress}
      </Button>
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