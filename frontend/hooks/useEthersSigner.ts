import { useMemo } from "react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import type { Account, Chain, Client, Transport, WalletClient } from "viem";
import { type Config, useConnectorClient } from "wagmi";

export function clientToSigner(client: Client<Transport, Chain, Account>) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  const provider = new BrowserProvider(transport, network);
  const signer = new JsonRpcSigner(provider, account.address);
  return signer;
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient<Config>({ chainId });
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client]);
}

export function walletClientToSigner(
    walletClient: WalletClient,
    callback: (signer: JsonRpcSigner) => void
  ) {
    const { chain, transport } = walletClient;
    const network = {
      chainId: chain?.id,
      name: chain?.name,
      ensAddress: chain?.contracts?.ensRegistry?.address,
    };
  
    walletClient.requestAddresses().then(([address]) => {
      const provider = new BrowserProvider(transport, network);
      const signer = new JsonRpcSigner(provider, address);
      callback(signer);
    });
  }
  