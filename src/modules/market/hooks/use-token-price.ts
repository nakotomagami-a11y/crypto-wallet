"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { TokenDetail } from "@/types/market";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

async function fetchTokenDetail(id: string): Promise<TokenDetail> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`
  );
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
  });
}
