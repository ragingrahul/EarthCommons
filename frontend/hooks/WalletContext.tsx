import React, { createContext, useContext } from "react";
import { WalletClient } from "viem";

type WalletContextType = {
  walletClient: WalletClient | undefined;
  setWalletClient: React.Dispatch<React.SetStateAction<WalletClient | undefined>>;
  initializeWalletClient: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WagmiProvider");
  }
  return context;
};

export default WalletContext;