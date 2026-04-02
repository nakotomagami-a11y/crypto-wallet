"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { CHAINS } from "@/lib/chains";
import { queryKeys } from "@/lib/query-keys";
import type { TokenBalance } from "@/types/transaction";

// ERC-20 ABI for balanceOf + decimals + symbol
const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

// Known Sepolia ERC-20 tokens to check
const SEPOLIA_TOKENS = [
  { address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", name: "USD Coin", symbol: "USDC", decimals: 6 },
  { address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", name: "Dai Stablecoin", symbol: "DAI", decimals: 18 },
  { address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", name: "Tether USD", symbol: "USDT", decimals: 6 },
  { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", name: "Chainlink", symbol: "LINK", decimals: 18 },
];

async function fetchEthBalances(address: string): Promise<TokenBalance[]> {
  const provider = new ethers.JsonRpcProvider(CHAINS.ethereum.rpcUrl);
  const results: TokenBalance[] = [];

  // Native ETH
  const ethBalance = await provider.getBalance(address);
  results.push({
    symbol: "ETH",
    name: "Ethereum",
    balance: ethers.formatEther(ethBalance),
    decimals: 18,
    network: "ethereum",
  });

  // ERC-20 tokens
  for (const token of SEPOLIA_TOKENS) {
    try {
      const contract = new ethers.Contract(token.address, ERC20_ABI, provider);
      const rawBalance: bigint = await contract.balanceOf(address);
      if (rawBalance > BigInt(0)) {
        results.push({
          symbol: token.symbol,
          name: token.name,
          balance: ethers.formatUnits(rawBalance, token.decimals),
          decimals: token.decimals,
          network: "ethereum",
          contractAddress: token.address,
        });
      }
    } catch {
      // Token contract may not exist on this network — skip
    }
  }

  return results;
}

async function fetchSolBalances(address: string): Promise<TokenBalance[]> {
  const connection = new Connection(CHAINS.solana.rpcUrl, "confirmed");
  const pubkey = new PublicKey(address);
  const results: TokenBalance[] = [];

  // Native SOL
  const solBalance = await connection.getBalance(pubkey);
  results.push({
    symbol: "SOL",
    name: "Solana",
    balance: (solBalance / LAMPORTS_PER_SOL).toString(),
    decimals: 9,
    network: "solana",
  });

  // SPL tokens
  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    });

    for (const { account } of tokenAccounts.value) {
      const parsed = account.data.parsed?.info;
      if (!parsed) continue;
      const amount = parsed.tokenAmount;
      if (amount.uiAmount > 0) {
        results.push({
          symbol: parsed.mint.slice(0, 6) + "...",
          name: "SPL Token",
          balance: amount.uiAmountString ?? amount.uiAmount.toString(),
          decimals: amount.decimals,
          network: "solana",
          contractAddress: parsed.mint,
        });
      }
    }
  } catch {
    // SPL token fetch may fail on devnet — skip
  }

  return results;
}

export function useBalances() {
  const { ethAddress, solAddress } = useWalletStore();

  const ethEnabled = !!ethAddress;
  const solEnabled = !!solAddress;

  const ethQuery = useQuery({
    queryKey: queryKeys.balances(ethAddress ?? "", "ethereum"),
    queryFn: () => fetchEthBalances(ethAddress!),
    enabled: ethEnabled,
    refetchInterval: 30_000,
    retry: 2,
  });

  const solQuery = useQuery({
    queryKey: queryKeys.balances(solAddress ?? "", "solana"),
    queryFn: () => fetchSolBalances(solAddress!),
    enabled: solEnabled,
    refetchInterval: 30_000,
    retry: 2,
  });

  const allBalances = [
    ...(ethQuery.data ?? []),
    ...(solQuery.data ?? []),
  ];

  const isLoading =
    (ethEnabled && ethQuery.isPending) || (solEnabled && solQuery.isPending);

  return {
    balances: allBalances,
    isLoading,
    error: ethQuery.error || solQuery.error,
    refetch: () => {
      ethQuery.refetch();
      solQuery.refetch();
    },
  };
}
