"use client";

import { use } from "react";
import Link from "next/link";
import { useTokenPrice } from "@/modules/market/hooks/use-token-price";
import { TokenDetail } from "@/modules/market/components/token-detail";
import { PriceChart } from "@/modules/market/components/price-chart";
import { PAGE_ROUTES } from "@/lib/routes";

export default function TokenPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: token, isLoading, error } = useTokenPrice(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={PAGE_ROUTES.market}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          Market
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="capitalize">{id}</span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" />
          <div className="h-[360px] animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" />
        </div>
      ) : error ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">
            Failed to load token data. CoinGecko may be rate-limited — try again shortly.
          </p>
        </div>
      ) : token ? (
        <>
          <TokenDetail token={token} />
          <PriceChart tokenId={id} />
        </>
      ) : null}
    </div>
  );
}
