"use client";

import { useState } from "react";
import { useTokenChart } from "@/modules/market/hooks/use-token-chart";
import { LineChart } from "./line-chart";
import { CandleChart } from "./candle-chart";
import { IntervalSelector } from "./interval-selector";
import { ChartTypeToggle } from "./chart-type-toggle";
import { ChartInterval, ChartType, type PricePoint, type OHLCDataPoint } from "@/types/market";

interface PriceChartProps {
  tokenId: string;
}

export function PriceChart({ tokenId }: PriceChartProps) {
  const [interval, setInterval] = useState<ChartInterval>(ChartInterval.Week);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Line);
  const { data, isLoading, error } = useTokenChart(tokenId, interval, chartType);

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <IntervalSelector value={interval} onChange={setInterval} />
        <ChartTypeToggle value={chartType} onChange={setChartType} />
      </div>

      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-eth-blue border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Failed to load chart data. CoinGecko may be rate-limited.
          </div>
        ) : chartType === ChartType.Line && data ? (
          <LineChart data={data as PricePoint[]} />
        ) : chartType === ChartType.Candle && data ? (
          <CandleChart data={data as OHLCDataPoint[]} />
        ) : null}
      </div>
    </div>
  );
}
