"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { ChartType, type OHLCDataPoint, type PricePoint, type ChartInterval } from "@/types/market";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

async function fetchOHLC(id: string, days: ChartInterval): Promise<OHLCDataPoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}/ohlc?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch OHLC");
  const data: number[][] = await res.json();
  return data.map(([timestamp, open, high, low, close]) => ({
    timestamp,
    open,
    high,
    low,
    close,
  }));
}

async function fetchLineData(id: string, days: ChartInterval): Promise<PricePoint[]> {
  const res = await fetch(
    `${COINGECKO_BASE}/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error("Failed to fetch chart data");
  const data = await res.json();
  return (data.prices as number[][]).map(([timestamp, price]) => ({
    timestamp,
    price,
  }));
}

export type ChartData = OHLCDataPoint[] | PricePoint[];

export function useTokenChart(id: string, interval: ChartInterval, chartType: ChartType) {
  return useQuery<ChartData>({
    queryKey: queryKeys.tokenChart(id, interval, chartType),
    queryFn: async (): Promise<ChartData> => {
      if (chartType === ChartType.Candle) return fetchOHLC(id, interval);
      return fetchLineData(id, interval);
    },
    enabled: !!id,
    staleTime: 60_000,
  });
}
