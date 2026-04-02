"use client";

import { useState, useRef, useEffect } from "react";
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
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (tokens.length <= 1) return null;

  const selectedColor = TOKEN_COLORS[value.symbol] ?? "#888";
  const selectedBalance = tokens.find(
    (t) => t.symbol === value.symbol && t.contractAddress === value.contractAddress
  );

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">Token</p>
      <div ref={wrapperRef} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex w-full items-center justify-between rounded-xl border border-[var(--outline-dim)] bg-transparent px-3 py-2.5 text-sm transition-colors hover:border-[var(--outline)]"
        >
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedColor }} />
            <span className="font-medium">{value.symbol}</span>
            {selectedBalance && (
              <span className="text-xs text-muted-foreground">
                {formatBalance(selectedBalance.balance, 4)} available
              </span>
            )}
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
        </button>

        {open && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-xl overflow-hidden border border-[var(--outline-dim)] bg-[var(--popover)] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
            {tokens.map((token) => {
              const color = TOKEN_COLORS[token.symbol] ?? "#888";
              const isActive =
                token.symbol === value.symbol &&
                token.contractAddress === value.contractAddress;
              return (
                <button
                  key={`${token.symbol}-${token.contractAddress ?? "native"}`}
                  onClick={() => {
                    onChange({
                      symbol: token.symbol,
                      name: token.name,
                      contractAddress: token.contractAddress,
                      decimals: token.decimals,
                    });
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-[rgba(255,255,255,0.08)]" : "hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="font-medium">{token.symbol}</span>
                    <span className="text-xs text-muted-foreground">{token.name}</span>
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatBalance(token.balance, 4)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
