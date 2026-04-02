"use client";

import { useState, useRef, useCallback } from "react";
import type { PricePoint } from "@/types/market";
import { formatPrice } from "@/modules/market/utils/format";

interface LineChartProps {
  data: PricePoint[];
}

const WIDTH = 800;
const HEIGHT = 300;
const PADDING = { top: 20, right: 20, bottom: 30, left: 20 };
const CHART_W = WIDTH - PADDING.left - PADDING.right;
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom;

export function LineChart({ data }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ x: number; price: number; date: string } | null>(null);

  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const isUp = data.length >= 2 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isUp ? "#30D158" : "#a91d3a";
  const gradientId = isUp ? "lineGradientUp" : "lineGradientDown";

  const toX = (i: number) => PADDING.left + (i / (data.length - 1)) * CHART_W;
  const toY = (price: number) =>
    PADDING.top + (1 - (price - minPrice) / priceRange) * CHART_H;

  const pathD = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${toX(i).toFixed(2)} ${toY(d.price).toFixed(2)}`)
    .join(" ");

  const areaD =
    pathD +
    ` L ${toX(data.length - 1).toFixed(2)} ${(PADDING.top + CHART_H).toFixed(2)}` +
    ` L ${PADDING.left.toFixed(2)} ${(PADDING.top + CHART_H).toFixed(2)} Z`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg || data.length === 0) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const idx = Math.round(((mouseX - PADDING.left) / CHART_W) * (data.length - 1));
      const clamped = Math.max(0, Math.min(data.length - 1, idx));
      const d = data[clamped];
      setHover({
        x: toX(clamped),
        price: d.price,
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

  if (data.length < 2) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Not enough data to display chart
      </div>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHover(null)}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const y = PADDING.top + pct * CHART_H;
        return (
          <line
            key={pct}
            x1={PADDING.left}
            y1={y}
            x2={PADDING.left + CHART_W}
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.06"
            strokeDasharray="4 4"
          />
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill={`url(#${gradientId})`} />

      {/* Line */}
      <path d={pathD} fill="none" stroke={strokeColor} strokeWidth="2" strokeLinejoin="round" />

      {/* Hover crosshair */}
      {hover && (
        <>
          <line
            x1={hover.x}
            y1={PADDING.top}
            x2={hover.x}
            y2={PADDING.top + CHART_H}
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeDasharray="3 3"
          />
          <circle
            cx={hover.x}
            cy={toY(hover.price)}
            r="4"
            fill={strokeColor}
            stroke="var(--background)"
            strokeWidth="2"
          />
          <rect
            x={Math.min(hover.x - 60, WIDTH - 130)}
            y={4}
            width="120"
            height="40"
            rx="8"
            fill="rgba(15, 20, 30, 0.9)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <text
            x={Math.min(hover.x, WIDTH - 70)}
            y={22}
            textAnchor="middle"
            fill="#e0dce6"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-geist-mono)"
          >
            {formatPrice(hover.price)}
          </text>
          <text
            x={Math.min(hover.x, WIDTH - 70)}
            y={38}
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="10"
          >
            {hover.date}
          </text>
        </>
      )}
    </svg>
  );
}
