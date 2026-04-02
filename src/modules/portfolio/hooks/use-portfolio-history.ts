"use client";

import { useQuery } from "@tanstack/react-query";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { useBalances } from "./use-balances";
import { EXTERNAL_API } from "@/lib/routes";

export interface PortfolioPoint {
  timestamp: number;
  value: number;
}

async function fetchPriceHistory(coinId: string, days: number): Promise<[number, number][]> {
  const res = await fetch(EXTERNAL_API.coingecko.marketChart(coinId, String(days)));
  if (!res.ok) return [];
  const data = await res.json();
  return data.prices ?? [];
}

function mergeWeighted(
  ethPrices: [number, number][],
  solPrices: [number, number][],
  ethBalance: number,
  solBalance: number
): PortfolioPoint[] {
  const ethMap = new Map(ethPrices.map(([t, p]) => [Math.floor(t / 3600000), p]));
  const solMap = new Map(solPrices.map(([t, p]) => [Math.floor(t / 3600000), p]));

  const allHours = new Set([...ethMap.keys(), ...solMap.keys()]);
  const sorted = [...allHours].sort((a, b) => a - b);

  return sorted.map((hour) => ({
    timestamp: hour * 3600000,
    value:
      (ethMap.get(hour) ?? 0) * ethBalance +
      (solMap.get(hour) ?? 0) * solBalance,
  }));
}

export function usePortfolioHistory(days = 7) {
  const { ethAddress, solAddress } = useWalletStore();
  const { balances } = useBalances();

  const ethBalance = parseFloat(
    balances.find((b) => b.symbol === "ETH")?.balance ?? "0"
  );
  const solBalance = parseFloat(
    balances.find((b) => b.symbol === "SOL")?.balance ?? "0"
  );

  return useQuery({
    queryKey: ["portfolioHistory", days, ethBalance, solBalance],
    queryFn: async () => {
      const [ethPrices, solPrices] = await Promise.all([
        fetchPriceHistory("ethereum", days),
        fetchPriceHistory("solana", days),
      ]);
      return mergeWeighted(ethPrices, solPrices, ethBalance, solBalance);
    },
    enabled: !!ethAddress || !!solAddress,
    staleTime: 120_000,
  });
}
