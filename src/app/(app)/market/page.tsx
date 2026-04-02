"use client";

import Link from "next/link";
import { TokenSearch } from "@/modules/market/components/token-search";

const POPULAR_TOKENS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "#F7931A" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "#627EEA" },
  { id: "solana", name: "Solana", symbol: "SOL", color: "#9945FF" },
  { id: "tether", name: "Tether", symbol: "USDT", color: "#26A17B" },
  { id: "usd-coin", name: "USD Coin", symbol: "USDC", color: "#2775CA" },
  { id: "binancecoin", name: "BNB", symbol: "BNB", color: "#F0B90B" },
  { id: "ripple", name: "XRP", symbol: "XRP", color: "#23292F" },
  { id: "cardano", name: "Cardano", symbol: "ADA", color: "#0033AD" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", color: "#C2A633" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", color: "#E6007A" },
  { id: "avalanche-2", name: "Avalanche", symbol: "AVAX", color: "#E84142" },
  { id: "chainlink", name: "Chainlink", symbol: "LINK", color: "#2A5ADA" },
];

export default function MarketPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Market</h1>

      <TokenSearch />

      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Popular Tokens
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {POPULAR_TOKENS.map((token) => (
            <Link
              key={token.id}
              href={`/market/${token.id}`}
              className="glass-card glass-card-hover flex items-center gap-3 rounded-xl px-4 py-3.5 transition-all duration-200"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: token.color }}
              >
                {token.symbol.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{token.name}</p>
                <p className="text-xs text-muted-foreground">{token.symbol}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
