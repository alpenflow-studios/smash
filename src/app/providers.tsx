'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { polygon } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ''}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#8B5CF6',
        },
        loginMethods: ['email', 'wallet', 'google'],
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        defaultChain: polygon,
        supportedChains: [polygon],
      }}
    >
      {children}
    </PrivyProvider>
  );
}