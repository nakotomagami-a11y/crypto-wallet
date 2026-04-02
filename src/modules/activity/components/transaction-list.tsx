"use client";

import { useTransactions } from "@/modules/activity/hooks/use-transactions";
import { TransactionRow } from "./transaction-row";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { NetworkBadge } from "@/modules/wallet/components/network-badge";
import type { NetworkId } from "@/types/wallet";

export function TransactionList() {
  const { activeNetwork, setNetwork } = useWalletStore();
  const { data: transactions, isLoading } = useTransactions();

  function handleNetworkToggle() {
    const next: NetworkId =
      activeNetwork === "ethereum" ? "solana" : "ethereum";
    setNetwork(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <NetworkBadge network={activeNetwork} onClick={handleNetworkToggle} />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      ) : !transactions?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-muted-foreground">
          <p className="text-sm">No transactions yet</p>
          <p className="text-xs mt-1">
            Send or receive tokens to see activity here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.map((tx) => (
            <TransactionRow key={tx.hash} tx={tx} />
          ))}
        </div>
      )}
    </div>
  );
}
