"use client";

import { useBalances } from "@/modules/portfolio/hooks/use-balances";
import { formatBalance } from "@/modules/portfolio/utils/format-balance";
import type { NetworkId } from "@/types/wallet";

export interface SelectedToken {
  symbol: string;
  name: string;
  contractAddress?: string;
  decimals: number;
}

interface TokenSelectorProps {
  network: NetworkId;
  value: SelectedToken;
  onChange: (token: SelectedToken) => void;
}

const TOKEN_COLORS: Record<string, string> = {
  ETH: "#627EEA",
  SOL: "#9945FF",
  USDC: "#2775CA",
  USDT: "#26A17B",
  DAI: "#F5AC37",
  LINK: "#2A5ADA",
};

export function TokenSelector({ network, value, onChange }: TokenSelectorProps) {
  const { balances } = useBalances();
  const tokens = balances.filter((b) => b.network === network);

  if (tokens.length <= 1) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">Token</p>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((token) => {
          const isActive =
            token.symbol === value.symbol &&
            token.contractAddress === value.contractAddress;
          const color = TOKEN_COLORS[token.symbol] ?? "#888";
          return (
            <button
              key={`${token.symbol}-${token.contractAddress ?? "native"}`}
              onClick={() =>
                onChange({
                  symbol: token.symbol,
                  name: token.name,
                  contractAddress: token.contractAddress,
                  decimals: token.decimals,
                })
              }
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[rgba(255,255,255,0.12)] text-foreground"
                  : "text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              {token.symbol}
              <span className="text-[10px] opacity-60">
                {formatBalance(token.balance, 2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
