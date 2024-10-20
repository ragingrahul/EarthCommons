"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { useCallback, useEffect, useState } from "react";
import { initSilk } from "@silk-wallet/silk-wallet-sdk";
import { WagmiProvider } from "wagmi";
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from "@/utils/config";
import WalletContext from "@/hooks/WalletContext";
import { WalletClient, createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import store from '@/state/store'
import { setConnection } from "@/state/app";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { selectConnection } from "@/state/selectors";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>
}

type Props = {
  children: React.ReactNode;
};
const queryClient = new QueryClient();
export function WalletProviders({ children }: Props) {
  const dispatch = useAppDispatch()
  const [connected, setConnected] = React.useState<boolean | undefined>(undefined);
  const [walletClient, setWalletClient] = useState<WalletClient | undefined>(undefined);
  const [userAddress, setUserAddress] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState("mainnet");

  const initializeWalletClient = useCallback(() => {
    let network = sepolia;
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
  
    // const checkConnection = async () => {
    //   try {
    //     // @ts-ignore
    //     const accounts = await window.silk.request({ method: 'eth_accounts' });
    //     if (accounts.length > 0) {
    //       const connect = {
    //         connected: true,
    //         userAddress: accounts[0]
    //       } 
    //       dispatch(setConnection(connect))
    //       initializeWalletClient();
    //     } else {
    //       dispatch(setConnection(undefined))
    //     }
    //   } catch (err) {
    //     console.error("Error checking connection:", err);
    //     dispatch(setConnection(undefined))
    //   }
    // };
    // checkConnection();
  }, [initializeWalletClient]);
  
  return (
    <WalletContext.Provider value={{  walletClient, setWalletClient, initializeWalletClient }}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </WalletContext.Provider>
  );
}
