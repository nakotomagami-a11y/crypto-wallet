"use client";

import { TransactionDirection } from "@/types/transaction";

export type DirectionFilter = "all" | TransactionDirection;
export type StatusFilter = "all" | "confirmed" | "failed";

interface TransactionFiltersProps {
  direction: DirectionFilter;
  onDirectionChange: (d: DirectionFilter) => void;
  status: StatusFilter;
  onStatusChange: (s: StatusFilter) => void;
}

const DIRECTION_OPTIONS: { value: DirectionFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: TransactionDirection.Sent, label: "Sent" },
  { value: TransactionDirection.Received, label: "Received" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "failed", label: "Failed" },
];

export function TransactionFilters({
  direction,
  onDirectionChange,
  status,
  onStatusChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Direction</span>
        <div className="flex gap-0.5 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
          {DIRECTION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onDirectionChange(opt.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                direction === opt.value
                  ? "bg-[rgba(255,255,255,0.1)] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</span>
        <div className="flex gap-0.5 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                status === opt.value
                  ? "bg-[rgba(255,255,255,0.1)] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
