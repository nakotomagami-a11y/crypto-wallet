"use client";

import { useQuery } from "@tanstack/react-query";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export interface CoinPrices {
  ethereum: { usd: number; usd_24h_change: number };
  solana: { usd: number; usd_24h_change: number };
}

async function fetchPrices(): Promise<CoinPrices> {
  const res = await fetch(
    `${COINGECKO_BASE}/simple/price?ids=ethereum,solana&vs_currencies=usd&include_24hr_change=true`
  );
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

export function usePrices() {
  return useQuery({
    queryKey: ["coinPrices"],
    queryFn: fetchPrices,
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}
