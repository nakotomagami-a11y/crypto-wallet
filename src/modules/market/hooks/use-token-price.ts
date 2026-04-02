"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { TokenDetail } from "@/types/market";
import { EXTERNAL_API } from "@/lib/routes";

async function fetchTokenDetail(id: string): Promise<TokenDetail> {
  const res = await fetch(EXTERNAL_API.coingecko.coinDetail(id));
  if (res.status === 429) throw new Error("Rate limited — try again in a moment");
  if (!res.ok) throw new Error("Failed to fetch token");
  const data = await res.json();
  const market = data.market_data;
  return {
    id: data.id,
    name: data.name,
    symbol: data.symbol.toUpperCase(),
    image: data.image?.large ?? data.image?.small ?? "",
    currentPrice: market.current_price.usd,
    priceChange24h: market.price_change_24h,
    priceChangePercentage24h: market.price_change_percentage_24h,
    marketCap: market.market_cap.usd,
    totalVolume: market.total_volume.usd,
    high24h: market.high_24h.usd,
    low24h: market.low_24h.usd,
  };
}

export function useTokenPrice(id: string) {
  return useQuery({
    queryKey: queryKeys.tokenDetail(id),
    queryFn: () => fetchTokenDetail(id),
    enabled: !!id,
    staleTime: 30_000,
    refetchInterval: 60_000,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
