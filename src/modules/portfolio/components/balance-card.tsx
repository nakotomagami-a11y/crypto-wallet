"use client";

import type { TokenBalance } from "@/types/transaction";
import { formatBalance } from "@/modules/portfolio/utils/format-balance";

interface BalanceCardProps {
  balance: TokenBalance;
}

const NETWORK_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  solana: "#9945FF",
};

export function BalanceCard({ balance }: BalanceCardProps) {
  const color = NETWORK_COLORS[balance.network] ?? "#888";
  const displayBalance = formatBalance(balance.balance);

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
          <p className="text-sm text-muted-foreground">{balance.symbol}</p>
        </div>
      </div>
    </div>
  );
}
