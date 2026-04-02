"use client";

import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_API } from "@/lib/routes";

export interface CoinPrices {
  ethereum: { usd: number; usd_24h_change: number };
  solana: { usd: number; usd_24h_change: number };
}

async function fetchPrices(): Promise<CoinPrices> {
  const res = await fetch(EXTERNAL_API.coingecko.simplePrice("ethereum,solana"));
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
