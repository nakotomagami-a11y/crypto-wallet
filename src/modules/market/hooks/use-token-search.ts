"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { TokenSearchResult } from "@/types/market";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

async function searchTokens(query: string): Promise<TokenSearchResult[]> {
  if (!query || query.length < 2) return [];
  const res = await fetch(`${COINGECKO_BASE}/search?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Search failed");
  const data = await res.json();
  return (data.coins ?? []).slice(0, 12).map(
    (c: { id: string; name: string; symbol: string; thumb: string; market_cap_rank: number | null }) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      thumb: c.thumb,
      market_cap_rank: c.market_cap_rank,
    })
  );
}

export function useTokenSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.tokenSearch(query),
    queryFn: () => searchTokens(query),
    enabled: query.length >= 2,
    staleTime: 60_000,
  });
}
