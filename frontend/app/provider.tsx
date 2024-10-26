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
import WalletContext, { useWallet } from "@/hooks/WalletContext";
import { WalletClient, createWalletClient, custom } from "viem";
import { sepolia } from "viem/chains";
import store from '@/state/store'
import { setConnection } from "@/state/app";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { selectConnection } from "@/state/selectors";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import easConfig from "@/EAS.config"
import { useEthersSigner, walletClientToSigner } from "@/hooks/useEthersSigner"


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
      // transport: custom(window.ethereum!)
    });
    setWalletClient(newWalletClient);
  }, [currentNetwork]);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
  
    const silk = initSilk();
    // @ts-ignore
    window.silk = silk;
    initializeWalletClient();
  }, []);
  
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


const EASContractAddress = easConfig.chains[String("11155111") as keyof typeof easConfig.chains]?.easContractAddress;
const eas = new EAS(EASContractAddress);

export const EASContext = React.createContext({ eas, isReady: false });

export function EASProvider ({ children }: { children: React.ReactNode }) {
  const {
    walletClient,
    setWalletClient,
  } = useWallet();
    
  const signer = useEthersSigner();
  const [signerReady, setSignerReady] = useState(false);

  useEffect(() => {
    if(walletClient){
      walletClientToSigner(walletClient, (signer) => {
        // Use signer here
        eas.connect(signer);
        setSignerReady(true);
        console.log("Eas connected");
      });
    }
  },[]);

  return <EASContext.Provider value={{ eas, isReady: signerReady }}>{children}</EASContext.Provider>;
};
