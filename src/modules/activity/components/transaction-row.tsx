"use client";

import { Badge } from "@/components/ui/badge";
import { TransactionStatus, TransactionDirection, type Transaction } from "@/types/transaction";
import { toast } from "sonner";

interface TransactionRowProps {
  tx: Transaction;
}

export function TransactionRow({ tx }: TransactionRowProps) {
  const date = new Date(tx.timestamp);
  const timeStr = tx.timestamp
    ? date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Pending";

  const explorerName = tx.network === "ethereum" ? "Etherscan" : "Solscan";
  const explorerColor = tx.network === "ethereum" ? "text-eth-blue" : "text-sol-purple";

  return (
    <div className="glass-card glass-card-hover flex items-center justify-between rounded-xl p-4 transition-all duration-200">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
            tx.direction === TransactionDirection.Sent
              ? "bg-chart-red/10 text-chart-red"
              : "bg-chart-green/10 text-chart-green"
          }`}
        >
          {tx.direction === TransactionDirection.Sent ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 17H7V7"/><path d="m17 7-10 10"/></svg>
          )}
        </div>
        <div>
          <p className="text-sm font-medium capitalize">{tx.direction}</p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(tx.hash);
              toast.success("Transaction hash copied!");
            }}
            className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Click to copy full hash"
          >
            {tx.hash.slice(0, 12)}...{tx.hash.slice(-6)}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          {tx.value && (
            <p className="text-sm font-mono">
              {tx.direction === TransactionDirection.Sent ? "-" : "+"}
              {parseFloat(tx.value).toLocaleString("en-US", { maximumFractionDigits: 6 })}
            </p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{timeStr}</span>
            <Badge
              variant="default"
              className={`text-[10px] px-1.5 py-0 ${
                tx.status === TransactionStatus.Confirmed
                  ? "bg-chart-green/10 text-chart-green border-chart-green/30"
                  : "bg-chart-red/10 text-chart-red border-chart-red/30"
              }`}
            >
              {tx.status}
            </Badge>
          </div>
        </div>
        <a
          href={tx.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold ${explorerColor} hover:bg-[rgba(255,255,255,0.06)] transition-colors`}
          onClick={(e) => e.stopPropagation()}
        >
          {explorerName}
        </a>
      </div>
    </div>
  );
}
