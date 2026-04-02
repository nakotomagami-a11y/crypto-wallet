"use client";

import { useQuery } from "@tanstack/react-query";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { CHAINS } from "@/lib/chains";
import { queryKeys } from "@/lib/query-keys";
import { TransactionStatus, TransactionDirection, type Transaction } from "@/types/transaction";
import type { NetworkId } from "@/types/wallet";

interface BlockscoutTx {
  hash: string;
  from: { hash: string };
  to: { hash: string } | null;
  value: string;
  timestamp: string;
  status: string;
}

async function fetchEthTransactions(address: string): Promise<Transaction[]> {
  // Use Blockscout API (free, no key required)
  const url = `https://eth-sepolia.blockscout.com/api/v2/addresses/${address}/transactions`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  const items: BlockscoutTx[] = json.items ?? [];

  return items.slice(0, 20).map((tx) => ({
    hash: tx.hash,
    network: "ethereum" as NetworkId,
    from: tx.from.hash,
    to: tx.to?.hash ?? "",
    value: (parseInt(tx.value) / 1e18).toString(),
    timestamp: new Date(tx.timestamp).getTime(),
    status: tx.status === "ok" ? TransactionStatus.Confirmed : TransactionStatus.Failed,
    direction:
      tx.from.hash.toLowerCase() === address.toLowerCase() ? TransactionDirection.Sent : TransactionDirection.Received,
    explorerUrl: `${CHAINS.ethereum.explorerUrl}/tx/${tx.hash}`,
  }));
}

async function fetchSolTransactions(address: string): Promise<Transaction[]> {
  const connection = new Connection(CHAINS.solana.rpcUrl, "confirmed");
  const pubkey = new PublicKey(address);
  const signatures = await connection.getSignaturesForAddress(pubkey, {
    limit: 20,
  });

  return signatures.map((sig) => ({
    hash: sig.signature,
    network: "solana" as NetworkId,
    from: address,
    to: "",
    value: "",
    timestamp: (sig.blockTime ?? 0) * 1000,
    status: sig.err ? TransactionStatus.Failed : TransactionStatus.Confirmed,
    direction: TransactionDirection.Sent,
    explorerUrl: `https://solscan.io/tx/${sig.signature}?cluster=devnet`,
  }));
}

export function useTransactions() {
  const { ethAddress, solAddress, activeNetwork } = useWalletStore();

  const address = activeNetwork === "ethereum" ? ethAddress : solAddress;

  return useQuery({
    queryKey: queryKeys.transactions(address ?? "", activeNetwork),
    queryFn: () => {
      if (!address) return [];
      if (activeNetwork === "ethereum") return fetchEthTransactions(address);
      return fetchSolTransactions(address);
    },
    enabled: !!address,
    refetchInterval: 60_000,
  });
}
