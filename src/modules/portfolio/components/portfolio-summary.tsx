"use client";

import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { formatBalance } from "@/modules/portfolio/utils/format-balance";
import type { TokenBalance } from "@/types/transaction";

interface PortfolioSummaryProps {
  balances: TokenBalance[];
}

export function PortfolioSummary({ balances }: PortfolioSummaryProps) {
  const { ethAddress, solAddress } = useWalletStore();

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Wallet Overview
        </h2>
        <div className="space-y-3">
          {balances.map((b) => (
            <div key={b.network} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{b.name}</span>
              <span className="font-mono text-sm">
                {formatBalance(b.balance)} {b.symbol}
              </span>
            </div>
          ))}
        </div>
        <div className="space-y-3 pt-3 border-t border-[var(--outline-dim)]">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">ETH Address</p>
              <p className="font-mono text-xs truncate">{ethAddress}</p>
            </div>
            {ethAddress && (
              <a
                href={`https://sepolia.etherscan.io/address/${ethAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-eth-blue hover:bg-eth-blue/10 transition-colors"
              >
                Etherscan
              </a>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">SOL Address</p>
              <p className="font-mono text-xs truncate">{solAddress}</p>
            </div>
            {solAddress && (
              <a
                href={`https://solscan.io/account/${solAddress}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sol-purple hover:bg-sol-purple/10 transition-colors"
              >
                Solscan
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
