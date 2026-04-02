"use client";

import { useState, useRef, useCallback } from "react";
import type { OHLCDataPoint } from "@/types/market";
import { formatPrice } from "@/modules/market/utils/format";

interface CandleChartProps {
  data: OHLCDataPoint[];
}

const WIDTH = 800;
const HEIGHT = 300;
const PADDING = { top: 20, right: 20, bottom: 30, left: 20 };
const CHART_W = WIDTH - PADDING.left - PADDING.right;
const CHART_H = HEIGHT - PADDING.top - PADDING.bottom;

const GREEN = "#30D158";
const RED = "#a91d3a";

export function CandleChart({ data }: CandleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (data.length < 2) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        Not enough data to display chart
      </div>
    );
  }

  const allPrices = data.flatMap((d) => [d.high, d.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice || 1;

  const candleWidth = Math.max(2, Math.min(12, (CHART_W / data.length) * 0.7));
  const gap = CHART_W / data.length;

  const toX = (i: number) => PADDING.left + i * gap + gap / 2;
  const toY = (price: number) =>
    PADDING.top + (1 - (price - minPrice) / priceRange) * CHART_H;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * WIDTH;
      const idx = Math.round((mouseX - PADDING.left) / gap - 0.5);
      setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
    },
    [data.length, gap]
  );

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full h-auto"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
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

      {/* Candles */}
      {data.map((d, i) => {
        const isUp = d.close >= d.open;
        const color = isUp ? GREEN : RED;
        const x = toX(i);
        const bodyTop = toY(Math.max(d.open, d.close));
        const bodyBottom = toY(Math.min(d.open, d.close));
        const bodyHeight = Math.max(1, bodyBottom - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line
              x1={x}
              y1={toY(d.high)}
              x2={x}
              y2={toY(d.low)}
              stroke={color}
              strokeWidth="1"
              strokeOpacity={hoverIdx === i ? 1 : 0.7}
            />
            {/* Body */}
            <rect
              x={x - candleWidth / 2}
              y={bodyTop}
              width={candleWidth}
              height={bodyHeight}
              fill={color}
              rx="1"
              opacity={hoverIdx === i ? 1 : 0.8}
            />
          </g>
        );
      })}

      {/* Hover tooltip */}
      {hovered && hoverIdx !== null && (
        <>
          <line
            x1={toX(hoverIdx)}
            y1={PADDING.top}
            x2={toX(hoverIdx)}
            y2={PADDING.top + CHART_H}
            stroke="currentColor"
            strokeOpacity="0.15"
            strokeDasharray="3 3"
          />
          <rect
            x={Math.min(toX(hoverIdx) - 70, WIDTH - 150)}
            y={4}
            width="140"
            height="54"
            rx="8"
            fill="rgba(15, 20, 30, 0.9)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
          <text
            x={Math.min(toX(hoverIdx), WIDTH - 80)}
            y={20}
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="9"
          >
            {new Date(hovered.timestamp).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </text>
          <text
            x={Math.min(toX(hoverIdx), WIDTH - 80)}
            y={36}
            textAnchor="middle"
            fill="#e0dce6"
            fontSize="11"
            fontWeight="600"
            fontFamily="var(--font-geist-mono)"
          >
            O:{formatPrice(hovered.open)} C:{formatPrice(hovered.close)}
          </text>
          <text
            x={Math.min(toX(hoverIdx), WIDTH - 80)}
            y={50}
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="10"
            fontFamily="var(--font-geist-mono)"
          >
            H:{formatPrice(hovered.high)} L:{formatPrice(hovered.low)}
          </text>
        </>
      )}
    </svg>
  );
}
