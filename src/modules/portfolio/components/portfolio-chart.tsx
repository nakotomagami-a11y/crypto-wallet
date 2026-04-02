"use client";

import { useState, useRef, useCallback } from "react";
import { usePortfolioHistory, type PortfolioPoint } from "@/modules/portfolio/hooks/use-portfolio-history";

const DAYS_OPTIONS = [
  { value: 1, label: "24H" },
  { value: 7, label: "7D" },
  { value: 30, label: "30D" },
];

const WIDTH = 800;
const HEIGHT = 200;
const PAD = { top: 16, right: 16, bottom: 24, left: 16 };
const CW = WIDTH - PAD.left - PAD.right;
const CH = HEIGHT - PAD.top - PAD.bottom;

function Chart({ data }: { data: PortfolioPoint[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ x: number; value: number; date: string } | null>(null);

  if (data.length < 2) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Not enough data yet
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const isUp = data[data.length - 1].value >= data[0].value;
  const color = isUp ? "#30D158" : "#a91d3a";

  const toX = (i: number) => PAD.left + (i / (data.length - 1)) * CW;
  const toY = (v: number) => PAD.top + (1 - (v - minVal) / range) * CH;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${toX(data.length - 1).toFixed(1)} ${(PAD.top + CH).toFixed(1)}` +
    ` L ${PAD.left.toFixed(1)} ${(PAD.top + CH).toFixed(1)} Z`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const idx = Math.round(((mouseX - PAD.left) / CW) * (data.length - 1));
      const clamped = Math.max(0, Math.min(data.length - 1, idx));
      const d = data[clamped];
      setHover({
        x: toX(clamped),
        value: d.value,
        date: new Date(d.timestamp).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    },
    [data]
  );

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.5, 1].map((pct) => (
        <line
          key={pct}
          x1={PAD.left}
          y1={PAD.top + pct * CH}
          x2={PAD.left + CW}
          y2={PAD.top + pct * CH}
          stroke="currentColor"
          strokeOpacity="0.05"
          strokeDasharray="4 4"
        />
      ))}

      <path d={areaD} fill="url(#portfolioGrad)" />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

      {hover && (
        <>
          <line
            x1={hover.x}
            y1={PAD.top}
            x2={hover.x}
            y2={PAD.top + CH}
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeDasharray="3 3"
          />
          <circle cx={hover.x} cy={toY(hover.value)} r="3.5" fill={color} stroke="var(--background)" strokeWidth="2" />
          <rect
            x={Math.min(hover.x - 50, WIDTH - 110)}
            y={2}
            width="100"
            height="36"
            rx="8"
            fill="rgba(15, 20, 30, 0.9)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <text
            x={Math.min(hover.x, WIDTH - 60)}
            y={18}
            textAnchor="middle"
            fill="#e0dce6"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-geist-mono)"
          >
            ${hover.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </text>
          <text
            x={Math.min(hover.x, WIDTH - 60)}
            y={32}
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="9"
          >
            {hover.date}
          </text>
        </>
      )}
    </svg>
  );
}

export function PortfolioChart() {
  const [days, setDays] = useState(7);
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
      </div>

      {isLoading ? (
        <div className="h-[200px] animate-pulse rounded-xl bg-[rgba(255,255,255,0.04)]" />
      ) : data ? (
        <Chart data={data} />
      ) : null}
    </div>
  );
}
