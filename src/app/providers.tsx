'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

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
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        },
        defaultChain: baseSepolia,
        supportedChains: [baseSepolia],
      }}
    >
      {children}
    </PrivyProvider>
  );
}