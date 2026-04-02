"use client";

import { useWallet } from "@/modules/wallet/hooks/use-wallet";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { NetworkBadge } from "@/modules/wallet/components/network-badge";
import { AccountSelector } from "@/modules/wallet/components/account-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { useCurrency, type Currency } from "@/hooks/use-currency";
import type { NetworkId } from "@/types/wallet";

export function Header() {
  const { activeNetwork, setNetwork, lock } = useWallet();
  const isDemo = useWalletStore((s) => s.isDemo);
  const { theme, toggleTheme } = useTheme();
  const { currency, setCurrency } = useCurrency();

  function handleNetworkToggle() {
    const next: NetworkId =
      activeNetwork === "ethereum" ? "solana" : "ethereum";
    setNetwork(next);
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--outline-dim)] bg-[var(--surface-dim)] px-6">
      <div className="flex items-center gap-2">
        <AccountSelector />
        <NetworkBadge network={activeNetwork} onClick={handleNetworkToggle} />
        {isDemo && (
          <Badge variant="default" className="bg-amber/10 text-amber border-amber/30 text-[10px]">
            DEMO
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-0.5 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
          {(["usd", "eur"] as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 ${
                currency === c
                  ? "bg-[rgba(255,255,255,0.1)] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>

        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === "dark" ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          )}
        </Button>

        <Button variant="ghost" size="sm" onClick={lock}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span className="ml-1.5 text-xs">Lock</span>
        </Button>
      </div>
    </header>
  );
}
