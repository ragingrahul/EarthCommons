"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useCallback, useEffect, useState } from "react";
import { initSilk } from "@silk-wallet/silk-wallet-sdk";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from "@/utils/config";
import WalletContext from "@/hooks/WalletContext";
import { WalletClient, createWalletClient, custom } from "viem";
import { mainnet, sepolia } from "viem/chains";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

type Props = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();
export function WalletProviders({ children }: Props) {
  const [connected, setConnected] = React.useState<boolean | undefined>(undefined);
  const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);
  const [userAddress, setUserAddress] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState("mainnet");

  const initializeWalletClient = useCallback(() => {
    let network = null;
    switch (currentNetwork) {
      case "mainnet":
        network = mainnet;
        break;
      case "sepolia":
        network = sepolia;
        break;
      default:
        network = mainnet;
        break;
    }
    const newWalletClient = createWalletClient({
      chain: network,
      // @ts-ignore
      transport: custom(window.silk as any),
    });
    setWalletClient(newWalletClient);
  }, [currentNetwork]);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
  
    const silk = initSilk();
    // @ts-ignore
    window.silk = silk;
  
    const checkConnection = async () => {
      try {
        // @ts-ignore
        const accounts = await window.silk.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setConnected(true);
          initializeWalletClient();
        } else {
          setConnected(false);
        }
      } catch (err) {
        console.error("Error checking connection:", err);
        setConnected(false);
      }
    };
    checkConnection();
  }, [initializeWalletClient]);
  
  return (
    <WalletContext.Provider value={{ connected, setConnected, walletClient, setWalletClient, userAddress, setUserAddress, currentNetwork, setCurrentNetwork, initializeWalletClient }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  );
}
