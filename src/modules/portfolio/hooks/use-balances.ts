"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { CHAINS } from "@/lib/chains";
import { queryKeys } from "@/lib/query-keys";
import {
  METAPLEX_TOKEN_METADATA_PROGRAM,
  SPL_TOKEN_PROGRAM,
  SEPOLIA_ERC20_TOKENS,
  ERC20_READ_ABI,
  MAX_SPL_TOKENS,
} from "@/lib/constants";
import type { TokenBalance } from "@/types/transaction";

const metaplexProgramId = new PublicKey(METAPLEX_TOKEN_METADATA_PROGRAM);
const splTokenProgramId = new PublicKey(SPL_TOKEN_PROGRAM);

async function resolveTokenName(
  connection: Connection,
  mintAddress: string
): Promise<{ name: string; symbol: string } | null> {
  const mint = new PublicKey(mintAddress);
  const [metadataPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), metaplexProgramId.toBytes(), mint.toBytes()],
    metaplexProgramId
  );

  const accountInfo = await connection.getAccountInfo(metadataPDA);
  if (!accountInfo?.data) return null;

  const data = accountInfo.data;
  try {
    const nameBytes = data.subarray(65, 101);
    const name = Buffer.from(nameBytes).toString("utf8").replace(/\0/g, "").trim();
    const symbolBytes = data.subarray(101, 115);
    const symbol = Buffer.from(symbolBytes).toString("utf8").replace(/\0/g, "").trim();
    if (name && symbol) return { name, symbol };
  } catch {
    return null;
  }
  return null;
}

async function fetchEthBalances(address: string): Promise<TokenBalance[]> {
  const provider = new ethers.JsonRpcProvider(CHAINS.ethereum.rpcUrl);
  const results: TokenBalance[] = [];

  const ethBalance = await provider.getBalance(address);
  results.push({
    symbol: "ETH",
    name: "Ethereum",
    balance: ethers.formatEther(ethBalance),
    decimals: 18,
    network: "ethereum",
  });

  for (const token of SEPOLIA_ERC20_TOKENS) {
    try {
      const contract = new ethers.Contract(token.address, ERC20_READ_ABI, provider);
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
      // Token contract may not exist on this network
    }
  }

  return results;
}

async function fetchSolBalances(address: string): Promise<TokenBalance[]> {
  const connection = new Connection(CHAINS.solana.rpcUrl, "confirmed");
  const pubkey = new PublicKey(address);
  const results: TokenBalance[] = [];

  const solBalance = await connection.getBalance(pubkey);
  results.push({
    symbol: "SOL",
    name: "Solana",
    balance: (solBalance / LAMPORTS_PER_SOL).toString(),
    decimals: 9,
    network: "solana",
  });

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubkey, {
      programId: splTokenProgramId,
    });

    const nonZero = tokenAccounts.value
      .filter((ta) => {
        const amount = ta.account.data.parsed?.info?.tokenAmount;
        return amount && amount.uiAmount > 0;
      })
      .slice(0, MAX_SPL_TOKENS);

    for (const { account } of nonZero) {
      const parsed = account.data.parsed?.info;
      if (!parsed) continue;
      const amount = parsed.tokenAmount;
      const mint = parsed.mint as string;

      let tokenName = "SPL Token";
      let tokenSymbol = mint.slice(0, 4) + "..." + mint.slice(-4);
      try {
        const metadata = await resolveTokenName(connection, mint);
        if (metadata) {
          tokenName = metadata.name;
          tokenSymbol = metadata.symbol;
        }
      } catch {
        // Metadata not available
      }

      results.push({
        symbol: tokenSymbol,
        name: tokenName,
        balance: amount.uiAmountString ?? amount.uiAmount.toString(),
        decimals: amount.decimals,
        network: "solana",
        contractAddress: mint,
      });
    }
  } catch {
    // SPL token fetch may fail on devnet
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

  const allBalances = [...(ethQuery.data ?? []), ...(solQuery.data ?? [])];
  const isLoading =
    (ethEnabled && ethQuery.isPending) || (solEnabled && solQuery.isPending);

  return {
    balances: allBalances,
    isLoading,
    error: ethQuery.error || solQuery.error,
    refetch: () => { ethQuery.refetch(); solQuery.refetch(); },
  };
}
