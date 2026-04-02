"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Connection } from "@solana/web3.js";
import { CHAINS } from "@/lib/chains";
import { EXTERNAL_API } from "@/lib/routes";
import { queryKeys } from "@/lib/query-keys";
import type { NetworkId } from "@/types/wallet";

async function fetchUsdPrice(coinId: string): Promise<number | null> {
  try {
    const res = await fetch(EXTERNAL_API.coingecko.simplePrice(coinId));
    if (!res.ok) return null;
    const data = await res.json();
    return data[coinId]?.usd ?? null;
  } catch {
    return null;
  }
}

export interface GasEstimate {
  fee: string;
  feeUsd?: string;
  symbol: string;
  details: string;
}

async function estimateEthGas(to: string): Promise<GasEstimate> {
  const provider = new ethers.JsonRpcProvider(CHAINS.ethereum.rpcUrl);
  const feeData = await provider.getFeeData();
  const gasPrice = feeData.gasPrice ?? BigInt(0);

  // Standard ETH transfer = 21000 gas
  const gasLimit = to ? BigInt(21000) : BigInt(21000);
  const totalWei = gasPrice * gasLimit;
  const feeEth = ethers.formatEther(totalWei);
  const gasPriceGwei = ethers.formatUnits(gasPrice, "gwei");

  const ethPrice = await fetchUsdPrice("ethereum");
  const feeNum = parseFloat(feeEth);
  const feeUsd = ethPrice ? `$${(feeNum * ethPrice).toFixed(4)}` : undefined;

  return {
    fee: feeNum.toFixed(6),
    feeUsd,
    symbol: "ETH",
    details: `${parseFloat(gasPriceGwei).toFixed(1)} Gwei · ${gasLimit.toString()} gas`,
  };
}

async function estimateSolFee(): Promise<GasEstimate> {
  const connection = new Connection(CHAINS.solana.rpcUrl, "confirmed");

  // Solana charges 5000 lamports per signature (standard transfer = 1 signature)
  // Plus priority fee from recent blocks
  const fees = await connection.getRecentPrioritizationFees();
  const avgPriority = fees.length > 0
    ? fees.reduce((sum, f) => sum + f.prioritizationFee, 0) / fees.length
    : 0;

  const baseFee = 5000; // lamports per signature
  const totalLamports = baseFee + Math.round(avgPriority);
  const feeSol = (totalLamports / 1e9).toFixed(9);

  const solPrice = await fetchUsdPrice("solana");
  const feeNum = parseFloat(feeSol);
  const feeUsd = solPrice ? `$${(feeNum * solPrice).toFixed(6)}` : undefined;

  return {
    fee: feeSol,
    feeUsd,
    symbol: "SOL",
    details: `Base: ${baseFee} lamports${avgPriority > 0 ? ` + ~${Math.round(avgPriority)} priority` : ""}`,
  };
}

export function useGasEstimate(network: NetworkId, to: string) {
  return useQuery({
    queryKey: queryKeys.gasEstimate(network, to, ""),
    queryFn: () => {
      if (network === "ethereum") return estimateEthGas(to);
      return estimateSolFee();
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
    retry: 1,
  });
}
