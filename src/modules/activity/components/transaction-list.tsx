"use client";

import { useState, useMemo } from "react";
import { useTransactions } from "@/modules/activity/hooks/use-transactions";
import { TransactionRow } from "./transaction-row";
import { TransactionFilters, type DirectionFilter, type StatusFilter } from "./transaction-filters";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { NetworkBadge } from "@/modules/wallet/components/network-badge";
import type { NetworkId } from "@/types/wallet";

export function TransactionList() {
  const { activeNetwork, setNetwork } = useWalletStore();
  const { data: transactions, isLoading } = useTransactions();
  const [direction, setDirection] = useState<DirectionFilter>("all");
  const [status, setStatus] = useState<StatusFilter>("all");

  function handleNetworkToggle() {
    const next: NetworkId = activeNetwork === "ethereum" ? "solana" : "ethereum";
    setNetwork(next);
  }

  const filtered = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((tx) => {
      if (direction !== "all" && tx.direction !== direction) return false;
      if (status !== "all" && tx.status !== status) return false;
      return true;
    });
  }, [transactions, direction, status]);

  const hasActiveFilters = direction !== "all" || status !== "all";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <NetworkBadge network={activeNetwork} onClick={handleNetworkToggle} />
      </div>

      {transactions && transactions.length > 0 && (
        <TransactionFilters
          direction={direction}
          onDirectionChange={setDirection}
          status={status}
          onStatusChange={setStatus}
        />
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : !transactions?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">Send or receive tokens to see activity here</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-8 text-muted-foreground">
          <p className="text-sm">No transactions match filters</p>
          <button
            onClick={() => { setDirection("all"); setStatus("all"); }}
            className="text-xs text-primary mt-1 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => (
            <TransactionRow key={tx.hash} tx={tx} />
          ))}
          {hasActiveFilters && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {filtered.length} of {transactions.length} transactions
            </p>
          )}
        </div>
      )}
    </div>
  );
}
