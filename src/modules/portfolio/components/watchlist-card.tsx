"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useWatchlist } from "@/modules/market/hooks/use-watchlist";
import { EXTERNAL_API } from "@/lib/routes";
import { PAGE_ROUTES } from "@/lib/routes";

interface PriceData {
  [id: string]: { usd: number; usd_24h_change: number };
}

export function WatchlistCard() {
  const { items, removeFromWatchlist } = useWatchlist();

  const ids = items.map((i) => i.id).join(",");
  const { data: prices } = useQuery<PriceData>({
    queryKey: ["watchlistPrices", ids],
    queryFn: async () => {
      if (!ids) return {};
      const res = await fetch(EXTERNAL_API.coingecko.simplePrice(ids));
      if (!res.ok) return {};
      return res.json();
    },
    enabled: ids.length > 0,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  if (items.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Watchlist
        </h2>
      </div>
      <div className="divide-y divide-[var(--outline-dim)]">
        {items.map((item) => {
          const price = prices?.[item.id];
          const change = price?.usd_24h_change;
          return (
            <div
              key={item.id}
              className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
            >
              <Link
                href={PAGE_ROUTES.marketToken(item.id)}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <img src={item.thumb} alt={item.name} className="h-7 w-7 rounded-full" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.symbol}</p>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  {price ? (
                    <>
                      <p className="font-mono text-sm font-medium">
                        ${price.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: price.usd >= 1 ? 2 : 6 })}
                      </p>
                      {change !== undefined && (
                        <p className={`text-xs ${change >= 0 ? "text-chart-green" : "text-chart-red"}`}>
                          {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                        </p>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">--</span>
                  )}
                </div>
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove from watchlist"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
