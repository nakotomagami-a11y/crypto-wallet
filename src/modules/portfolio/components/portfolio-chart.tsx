"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePortfolioHistory, type PortfolioPoint } from "@/modules/portfolio/hooks/use-portfolio-history";
import { ChartTypeToggle } from "@/modules/market/components/chart-type-toggle";
import { ChartType } from "@/types/market";

const DAYS_OPTIONS = [
  { value: 1, label: "24H" },
  { value: 7, label: "7D" },
  { value: 30, label: "30D" },
];

const CHART_HEIGHT = 200;
const PAD = { top: 8, right: 8, bottom: 8, left: 8 };

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(ref.current);
    setWidth(ref.current.clientWidth);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

// ─── Line Chart ──────────────────────────────────────────────

function LineChartInner({
  data,
  width,
}: {
  data: PortfolioPoint[];
  width: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const cw = width - PAD.left - PAD.right;
  const ch = CHART_HEIGHT - PAD.top - PAD.bottom;

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const isUp = data[data.length - 1].value >= data[0].value;
  const color = isUp ? "#30D158" : "#a91d3a";

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * cw;
  const toY = (v: number) => PAD.top + (1 - (v - minVal) / range) * ch;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${toX(data.length - 1).toFixed(1)} ${(PAD.top + ch).toFixed(1)}` +
    ` L ${PAD.left.toFixed(1)} ${(PAD.top + ch).toFixed(1)} Z`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const idx = Math.round(((mouseX - PAD.left) / cw) * (data.length - 1));
      setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
    },
    [data.length, cw]
  );

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={CHART_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="pfGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 0.5, 1].map((pct) => (
          <line
            key={pct}
            x1={PAD.left} y1={PAD.top + pct * ch}
            x2={PAD.left + cw} y2={PAD.top + pct * ch}
            stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 4"
          />
        ))}

        <path d={areaD} fill="url(#pfGrad)" />
        <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />

        {hoverIdx !== null && (
          <>
            <line
              x1={toX(hoverIdx)} y1={PAD.top}
              x2={toX(hoverIdx)} y2={PAD.top + ch}
              stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 3"
            />
            <circle
              cx={toX(hoverIdx)} cy={toY(hovered!.value)}
              r="4" fill={color} stroke="var(--background)" strokeWidth="2"
            />
          </>
        )}
      </svg>

      {/* HTML tooltip — doesn't scale with SVG */}
      {hovered && hoverIdx !== null && (
        <div
          className="absolute top-1 pointer-events-none rounded-lg bg-[rgba(15,20,30,0.92)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5"
          style={{ left: Math.min(toX(hoverIdx), width - 120) }}
        >
          <p className="font-mono text-xs font-semibold text-foreground">
            ${hovered.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-muted-foreground">
            {new Date(hovered.timestamp).toLocaleDateString(undefined, {
              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Candle Chart ────────────────────────────────────────────

function CandleChartInner({
  data,
  width,
}: {
  data: PortfolioPoint[];
  width: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Group data into candles (every N points = 1 candle)
  const candleSize = Math.max(2, Math.floor(data.length / 40));
  const candles: { open: number; close: number; high: number; low: number; timestamp: number }[] = [];
  for (let i = 0; i < data.length; i += candleSize) {
    const slice = data.slice(i, i + candleSize);
    const vals = slice.map((d) => d.value);
    candles.push({
      open: slice[0].value,
      close: slice[slice.length - 1].value,
      high: Math.max(...vals),
      low: Math.min(...vals),
      timestamp: slice[0].timestamp,
    });
  }

  if (candles.length < 2) return null;

  const cw = width - PAD.left - PAD.right;
  const ch = CHART_HEIGHT - PAD.top - PAD.bottom;
  const allVals = candles.flatMap((c) => [c.high, c.low]);
  const minVal = Math.min(...allVals);
  const maxVal = Math.max(...allVals);
  const range = maxVal - minVal || 1;

  const gap = cw / candles.length;
  const candleW = Math.max(2, Math.min(10, gap * 0.7));
  const toX = (i: number) => PAD.left + i * gap + gap / 2;
  const toY = (v: number) => PAD.top + (1 - (v - minVal) / range) * ch;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const idx = Math.round((mouseX - PAD.left) / gap - 0.5);
      setHoverIdx(Math.max(0, Math.min(candles.length - 1, idx)));
    },
    [candles.length, gap]
  );

  const hovered = hoverIdx !== null ? candles[hoverIdx] : null;

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={CHART_HEIGHT}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        {[0, 0.5, 1].map((pct) => (
          <line
            key={pct}
            x1={PAD.left} y1={PAD.top + pct * ch}
            x2={PAD.left + cw} y2={PAD.top + pct * ch}
            stroke="currentColor" strokeOpacity="0.05" strokeDasharray="4 4"
          />
        ))}

        {candles.map((c, i) => {
          const isUp = c.close >= c.open;
          const clr = isUp ? "#30D158" : "#a91d3a";
          const x = toX(i);
          const bodyTop = toY(Math.max(c.open, c.close));
          const bodyBot = toY(Math.min(c.open, c.close));
          return (
            <g key={i}>
              <line x1={x} y1={toY(c.high)} x2={x} y2={toY(c.low)} stroke={clr} strokeWidth="1" strokeOpacity={hoverIdx === i ? 1 : 0.6} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={Math.max(1, bodyBot - bodyTop)} fill={clr} rx="1" opacity={hoverIdx === i ? 1 : 0.75} />
            </g>
          );
        })}

        {hoverIdx !== null && (
          <line
            x1={toX(hoverIdx)} y1={PAD.top}
            x2={toX(hoverIdx)} y2={PAD.top + ch}
            stroke="currentColor" strokeOpacity="0.15" strokeDasharray="3 3"
          />
        )}
      </svg>

      {hovered && hoverIdx !== null && (
        <div
          className="absolute top-1 pointer-events-none rounded-lg bg-[rgba(15,20,30,0.92)] border border-[rgba(255,255,255,0.1)] px-2.5 py-1.5"
          style={{ left: Math.min(toX(hoverIdx), width - 140) }}
        >
          <p className="text-[10px] text-muted-foreground">
            {new Date(hovered.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="font-mono text-[11px] text-foreground">
            O:${hovered.open.toFixed(2)} C:${hovered.close.toFixed(2)}
          </p>
          <p className="font-mono text-[10px] text-muted-foreground">
            H:${hovered.high.toFixed(2)} L:${hovered.low.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────

export function PortfolioChart() {
  const [days, setDays] = useState(7);
  const [chartType, setChartType] = useState<ChartType>(ChartType.Line);
  const { data, isLoading } = usePortfolioHistory(days);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartWidth = useContainerWidth(containerRef);

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
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Portfolio Value
          </p>
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
                  days === opt.value
                    ? "bg-eth-blue text-white"
                    : "text-muted-foreground hover:bg-[rgba(255,255,255,0.06)]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </div>
      </div>

      <div ref={containerRef}>
        {isLoading ? (
          <div className="h-[200px] animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)]" />
        ) : data && data.length >= 2 ? (
          chartType === ChartType.Line ? (
            <LineChartInner data={data} width={chartWidth} />
          ) : (
            <CandleChartInner data={data} width={chartWidth} />
          )
        ) : (
          <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            Not enough data yet
          </div>
        )}
      </div>
    </div>
  );
}
