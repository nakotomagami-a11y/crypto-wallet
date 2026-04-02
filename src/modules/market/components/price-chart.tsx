"use client";

import { useState, useRef, useEffect } from "react";
import { createChart, ColorType, LineSeries, AreaSeries, CandlestickSeries, type IChartApi } from "lightweight-charts";
import { useTokenChart } from "@/modules/market/hooks/use-token-chart";
import { toLineDataFromPrices, toCandlestickData } from "@/lib/chart-utils";
import { IntervalSelector } from "./interval-selector";
import { ChartTypeToggle } from "./chart-type-toggle";
import { ChartInterval, ChartType, type PricePoint, type OHLCDataPoint } from "@/types/market";

const CHART_HEIGHT = 350;

interface PriceChartProps {
  tokenId: string;
}

function MarketChartContainer({
  data,
  chartType,
}: {
  data: PricePoint[] | OHLCDataPoint[];
  chartType: ChartType;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      height: CHART_HEIGHT,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#a0a0b0",
        fontFamily: "'Nunito', sans-serif",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.03)" },
        horzLines: { color: "rgba(255,255,255,0.03)" },
      },
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.05, bottom: 0.05 } },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    if (chartType === ChartType.Line) {
      const points = data as PricePoint[];
      const isUp = points.length >= 2 && points[points.length - 1].price >= points[0].price;
      const color = isUp ? "#30D158" : "#a91d3a";
      const lineData = toLineDataFromPrices(points);

      const series = chart.addSeries(LineSeries, {
        color,
        lineWidth: 2,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: color,
      });
      series.setData(lineData);

      const area = chart.addSeries(AreaSeries, {
        topColor: `${color}40`,
        bottomColor: `${color}05`,
        lineColor: "transparent",
        lineWidth: 1,
      });
      area.setData(lineData);
    } else {
      const ohlc = data as OHLCDataPoint[];

      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#30D158", downColor: "#a91d3a",
        borderUpColor: "#30D158", borderDownColor: "#a91d3a",
        wickUpColor: "#30D158", wickDownColor: "#a91d3a",
      });
      series.setData(toCandlestickData(ohlc));
    }

    chart.timeScale().fitContent();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) chart.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(containerRef.current);

    return () => { observer.disconnect(); chart.remove(); };
  }, [data, chartType]);

  return <div ref={containerRef} />;
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

      <div className="min-h-[350px]">
        {isLoading ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-eth-blue border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex h-[350px] items-center justify-center text-sm text-muted-foreground">
            Failed to load chart data. CoinGecko may be rate-limited.
          </div>
        ) : data ? (
          <MarketChartContainer data={data} chartType={chartType} />
        ) : null}
      </div>
    </div>
  );
}
