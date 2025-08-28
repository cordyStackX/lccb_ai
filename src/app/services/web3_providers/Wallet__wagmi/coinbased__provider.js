'use client';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import '@rainbow-me/rainbowkit/styles.css';
import { defineChain } from 'viem';
import configuration from '@/app/config/conf/setting.json';

// Define your custom Base Sepolia chain
const baseSepolia = defineChain({
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    name: 'Base Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_LINK_PROJECT_ID || configuration.PUBLIC_ACCESS.RPC_Endpoint,
      ],
    },
    public: {
      http: [
        process.env.NEXT_PUBLIC_LINK_PROJECT_ID || configuration.PUBLIC_ACCESS.RPC_Endpoint,
      ],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: 'Test Wallet App',
  projectId: '7f849b22-bdf9-40e2-91a2-0b4a0c12afc9', // walletconnect projectId
  chains: [baseSepolia], // Use your custom chain here!
});

const queryClient = new QueryClient();

export default function WalletProviders({ children }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[baseSepolia]}>
          <OnchainKitProvider>
            {children}
          </OnchainKitProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}
