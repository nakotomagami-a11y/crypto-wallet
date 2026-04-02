"use client";

import { useState, useRef, useEffect } from "react";
import { createChart, ColorType, LineSeries, AreaSeries, CandlestickSeries, type IChartApi, type CandlestickData, type LineData, type Time } from "lightweight-charts";
import { usePortfolioHistory, type PortfolioPoint } from "@/modules/portfolio/hooks/use-portfolio-history";
import { ChartTypeToggle } from "@/modules/market/components/chart-type-toggle";
import { ChartType } from "@/types/market";

const DAYS_OPTIONS = [
  { value: 1, label: "24H" },
  { value: 7, label: "7D" },
  { value: 30, label: "30D" },
];

const CHART_HEIGHT = 220;

function toLineData(data: PortfolioPoint[]): LineData<Time>[] {
  return data.map((d) => ({
    time: (d.timestamp / 1000) as Time,
    value: d.value,
  }));
}

function toCandleData(data: PortfolioPoint[]): CandlestickData<Time>[] {
  const candleSize = Math.max(2, Math.floor(data.length / 40));
  const candles: CandlestickData<Time>[] = [];
  for (let i = 0; i < data.length; i += candleSize) {
    const slice = data.slice(i, i + candleSize);
    const vals = slice.map((d) => d.value);
    candles.push({
      time: (slice[0].timestamp / 1000) as Time,
      open: slice[0].value,
      close: slice[slice.length - 1].value,
      high: Math.max(...vals),
      low: Math.min(...vals),
    });
  }
  return candles;
}

function ChartContainer({ data, chartType }: { data: PortfolioPoint[]; chartType: ChartType }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const isUp = data.length >= 2 && data[data.length - 1].value >= data[0].value;
  const lineColor = isUp ? "#30D158" : "#a91d3a";

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
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      handleScroll: false,
      handleScale: false,
    });
    chartRef.current = chart;

    if (chartType === ChartType.Line) {
      const lineData = toLineData(data);
      const series = chart.addSeries(LineSeries, {
        color: lineColor,
        lineWidth: 2,
        crosshairMarkerRadius: 4,
        crosshairMarkerBackgroundColor: lineColor,
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
      series.setData(lineData);

      const area = chart.addSeries(AreaSeries, {
        topColor: `${lineColor}40`,
        bottomColor: `${lineColor}05`,
        lineColor: "transparent",
        lineWidth: 1,
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
      area.setData(lineData);
    } else {
      const series = chart.addSeries(CandlestickSeries, {
        upColor: "#30D158", downColor: "#a91d3a",
        borderUpColor: "#30D158", borderDownColor: "#a91d3a",
        wickUpColor: "#30D158", wickDownColor: "#a91d3a",
        priceFormat: { type: "price", precision: 2, minMove: 0.01 },
      });
      series.setData(toCandleData(data));
    }

    chart.timeScale().fitContent();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) chart.applyOptions({ width: entry.contentRect.width });
    });
    observer.observe(containerRef.current);

    return () => { observer.disconnect(); chart.remove(); };
  }, [data, chartType, lineColor]);

  return <div ref={containerRef} />;
}

export function PortfolioChart() {
  const [days, setDays] = useState(7);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Line);
  const { data, isLoading } = usePortfolioHistory(days);

  const currentValue = data && data.length > 0 ? data[data.length - 1].value : null;
  const startValue = data && data.length > 0 ? data[0].value : null;
  const change =
    currentValue !== null && startValue !== null && startValue > 0
      ? ((currentValue - startValue) / startValue) * 100
      : null;

  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Portfolio Value</p>
          {currentValue !== null && (
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold font-mono">
                ${currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {change !== null && (
                <span className={`text-xs font-medium ${change >= 0 ? "text-chart-green" : "text-chart-red"}`}>
                  {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {DAYS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDays(opt.value)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200 ${
                  days === opt.value ? "bg-eth-blue text-white" : "text-muted-foreground hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </div>
      </div>

      {isLoading ? (
        <div className="h-[220px] animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)]" />
      ) : data && data.length >= 2 ? (
        <ChartContainer data={data} chartType={chartType} />
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
          Not enough data yet
        </div>
      )}
    </div>
  );
}
