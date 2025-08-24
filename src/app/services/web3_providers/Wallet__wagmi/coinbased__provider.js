'use client';

import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'wagmi/chains';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@rainbow-me/rainbowkit/styles.css';

// Wagmi + Rainbow config
const config = getDefaultConfig({
  appName: 'Test Wallet App',
  projectId: '2a6ea45d7b774258abb68a5e1d7d80e0', // walletconnect projectId
  chains: [mainnet],
});

const queryClient = new QueryClient();

export default function WalletProviders({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <OnchainKitProvider>
            {children}
          </OnchainKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
