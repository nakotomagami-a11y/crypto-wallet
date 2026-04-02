"use client";

import type { TokenBalance } from "@/types/transaction";
import { formatBalance } from "@/modules/portfolio/utils/format-balance";
import { useCurrency } from "@/hooks/use-currency";

interface BalanceCardProps {
  balance: TokenBalance;
  fiatPrice?: number;
  change24h?: number;
}

const NETWORK_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  solana: "#9945FF",
};

export function BalanceCard({ balance, fiatPrice, change24h }: BalanceCardProps) {
  const color = NETWORK_COLORS[balance.network] ?? "#888";
  const displayBalance = formatBalance(balance.balance);
  const fiatValue = fiatPrice ? parseFloat(balance.balance) * fiatPrice : null;
  const { symbol: currencySymbol } = useCurrency();

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm"
            style={{ backgroundColor: color }}
          >
            {balance.symbol.charAt(0)}
          </div>
          <div>
            <p className="font-medium">{balance.name}</p>
            <p className="text-sm text-muted-foreground">{balance.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold">{displayBalance}</p>
          {fiatValue !== null ? (
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-sm text-muted-foreground">
                {currencySymbol}{fiatValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {change24h !== undefined && change24h !== null && (
                <span className={`text-xs font-medium ${change24h >= 0 ? "text-chart-green" : "text-chart-red"}`}>
                  {change24h >= 0 ? "+" : ""}{change24h.toFixed(1)}%
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">{balance.symbol}</p>
          )}
        </div>
      </div>
    </div>
  );
}
