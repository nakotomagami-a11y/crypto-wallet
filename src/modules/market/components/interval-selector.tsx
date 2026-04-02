"use client";

import { ChartInterval } from "@/types/market";

const INTERVALS: { value: ChartInterval; label: string }[] = [
  { value: ChartInterval.Day, label: "1D" },
  { value: ChartInterval.Week, label: "7D" },
  { value: ChartInterval.Month, label: "30D" },
  { value: ChartInterval.Year, label: "1Y" },
];

interface IntervalSelectorProps {
  value: ChartInterval;
  onChange: (interval: ChartInterval) => void;
}

export function IntervalSelector({ value, onChange }: IntervalSelectorProps) {
  return (
    <div className="flex gap-1">
      {INTERVALS.map((interval) => (
        <button
          key={interval.value}
          onClick={() => onChange(interval.value)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            value === interval.value
              ? "bg-eth-blue text-white"
              : "text-muted-foreground hover:bg-[rgba(255,255,255,0.06)] hover:text-foreground"
          }`}
        >
          {interval.label}
        </button>
      ))}
    </div>
  );
}
