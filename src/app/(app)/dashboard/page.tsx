"use client";

import { useBalances } from "@/modules/portfolio/hooks/use-balances";
import { BalanceCard } from "@/modules/portfolio/components/balance-card";
import { TokenList } from "@/modules/portfolio/components/token-list";
import { PortfolioSummary } from "@/modules/portfolio/components/portfolio-summary";
import { FaucetLinks } from "@/modules/portfolio/components/faucet-links";
import { PortfolioChart } from "@/modules/portfolio/components/portfolio-chart";
import { usePrices } from "@/modules/portfolio/hooks/use-prices";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import type { NetworkId } from "@/types/wallet";
import { PAGE_ROUTES } from "@/lib/routes";

export default function DashboardPage() {
  const { balances, isLoading, error } = useBalances();
  const { data: prices } = usePrices();

  // Native tokens (ETH, SOL) for the big balance cards
  const nativeBalances = balances.filter((b) => !b.contractAddress);
  // All tokens for the full list
  const hasTokens = balances.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Link href={PAGE_ROUTES.send} className={buttonVariants({ size: "sm" })}>
            Send
          </Link>
          <Link href={PAGE_ROUTES.receive} className={buttonVariants({ variant: "outline", size: "sm" })}>
            Receive
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]"
              />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]" />
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to fetch balances. The RPC may be rate-limited — try again shortly.
            </div>
          )}

          {/* Native balance cards */}
          <div className="grid gap-4 md:grid-cols-2">
            {nativeBalances.length > 0 ? (
              nativeBalances.map((b) => {
                const coinId = b.network === "ethereum" ? "ethereum" : "solana";
                const price = prices?.[coinId as keyof typeof prices];
                return (
                  <BalanceCard
                    key={b.network}
                    balance={b}
                    usdPrice={price?.usd}
                    usd24hChange={price?.usd_24h_change}
                  />
                );
              })
            ) : !error ? (
              <p className="text-sm text-muted-foreground col-span-2">
                No balance data available yet.
              </p>
            ) : null}
          </div>

          <PortfolioChart />

          <PortfolioSummary balances={nativeBalances} />

          <FaucetLinks />

          {/* Full token list */}
          {hasTokens && <TokenList balances={balances} />}
        </>
      )}
    </div>
  );
}
