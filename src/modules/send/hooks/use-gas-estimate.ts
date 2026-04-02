"use client";

import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { Connection } from "@solana/web3.js";
import { CHAINS } from "@/lib/chains";
import { queryKeys } from "@/lib/query-keys";
import type { NetworkId } from "@/types/wallet";

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

  return {
    fee: parseFloat(feeEth).toFixed(6),
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

  return {
    fee: feeSol,
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
