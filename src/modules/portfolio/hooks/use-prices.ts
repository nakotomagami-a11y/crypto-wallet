"use client";

import { useQuery } from "@tanstack/react-query";
import { EXTERNAL_API } from "@/lib/routes";
import { useCurrency } from "@/hooks/use-currency";

export interface CoinPriceEntry {
  [key: string]: number; // e.g. usd: 1800, eur: 1650, usd_24h_change: 2.5
}

export interface CoinPrices {
  ethereum: CoinPriceEntry;
  solana: CoinPriceEntry;
}

async function fetchPrices(currency: string): Promise<CoinPrices> {
  const res = await fetch(EXTERNAL_API.coingecko.simplePrice("ethereum,solana", currency));
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

export function usePrices() {
  const { currency } = useCurrency();

  return useQuery({
    queryKey: ["coinPrices", currency],
    queryFn: () => fetchPrices(currency),
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: 2,
  });
}
