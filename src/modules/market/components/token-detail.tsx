"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice, formatPercentChange, formatMarketCap, formatVolume } from "@/modules/market/utils/format";
import type { TokenDetail as TokenDetailType } from "@/types/market";

interface TokenDetailProps {
  token: TokenDetailType;
}

export function TokenDetail({ token }: TokenDetailProps) {
  const isUp = token.priceChangePercentage24h >= 0;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={token.image}
          alt={token.name}
          className="h-12 w-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">{token.name}</h1>
            <span className="text-sm text-muted-foreground uppercase">
              {token.symbol}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold font-mono">
              {formatPrice(token.currentPrice)}
            </span>
            <Badge
              variant="default"
              className={`text-xs ${
                isUp
                  ? "bg-chart-green/10 text-chart-green border-chart-green/30"
                  : "bg-chart-red/10 text-chart-red border-chart-red/30"
              }`}
            >
              {formatPercentChange(token.priceChangePercentage24h)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--outline-dim)]">
        <div>
          <p className="text-xs text-muted-foreground">Market Cap</p>
          <p className="text-sm font-mono font-medium">
            {formatMarketCap(token.marketCap)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">24h Volume</p>
          <p className="text-sm font-mono font-medium">
            {formatVolume(token.totalVolume)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">24h High</p>
          <p className="text-sm font-mono font-medium text-chart-green">
            {formatPrice(token.high24h)}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">24h Low</p>
          <p className="text-sm font-mono font-medium text-chart-red">
            {formatPrice(token.low24h)}
          </p>
        </div>
      </div>
    </div>
  );
}
