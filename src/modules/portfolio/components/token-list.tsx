"use client";

import type { TokenBalance } from "@/types/transaction";
import { formatBalance } from "@/modules/portfolio/utils/format-balance";

interface TokenListProps {
  balances: TokenBalance[];
}

const NETWORK_COLORS: Record<string, string> = {
  ethereum: "#627EEA",
  solana: "#9945FF",
};

const TOKEN_COLORS: Record<string, string> = {
  ETH: "#627EEA",
  SOL: "#9945FF",
  USDC: "#2775CA",
  USDT: "#26A17B",
  DAI: "#F5AC37",
  LINK: "#2A5ADA",
};

export function TokenList({ balances }: TokenListProps) {
  if (balances.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          All Tokens
        </h2>
      </div>
      <div className="divide-y divide-[var(--outline-dim)]">
        {balances.map((token, i) => {
          const color =
            TOKEN_COLORS[token.symbol] ??
            NETWORK_COLORS[token.network] ??
            "#888";
          return (
            <div
              key={`${token.network}-${token.symbol}-${i}`}
              className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-[rgba(255,255,255,0.03)]"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
                  style={{ backgroundColor: color }}
                >
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{token.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {token.symbol}
                    {token.contractAddress && (
                      <span className="ml-1 opacity-50">
                        &middot; {token.network === "ethereum" ? "ERC-20" : "SPL"}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold">
                  {formatBalance(token.balance)}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {token.network}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
