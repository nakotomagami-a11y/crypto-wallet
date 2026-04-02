"use client";

import { ChartType } from "@/types/market";

interface ChartTypeToggleProps {
  value: ChartType;
  onChange: (type: ChartType) => void;
}

export function ChartTypeToggle({ value, onChange }: ChartTypeToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
      <button
        onClick={() => onChange(ChartType.Line)}
        className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
          value === ChartType.Line
            ? "bg-[rgba(255,255,255,0.1)] text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Line chart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 12-4-4-6 6-4-4-6 6"/></svg>
      </button>
      <button
        onClick={() => onChange(ChartType.Candle)}
        className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
          value === ChartType.Candle
            ? "bg-[rgba(255,255,255,0.1)] text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title="Candlestick chart"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5v4"/><rect width="4" height="6" x="7" y="9" rx="1"/><path d="M9 15v2"/><path d="M17 3v4"/><rect width="4" height="8" x="15" y="7" rx="1"/><path d="M17 15v4"/></svg>
      </button>
    </div>
  );
}
