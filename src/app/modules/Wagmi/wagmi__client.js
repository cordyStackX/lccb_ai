'use client';

import dynamic from 'next/dynamic';

// Dynamically import WalletProviders with SSR disabled
const WalletProviders = dynamic(() => import('@/app/services/web3_providers/Wallet__wagmi/coinbased__provider'), {
  ssr: false,
});

export default function ProvidersClientWrapper({ children }) {
  return <WalletProviders>{children}</WalletProviders>;
}