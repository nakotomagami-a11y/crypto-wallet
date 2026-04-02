import type { CandlestickData, LineData, Time } from "lightweight-charts";

export interface TimestampValue {
  timestamp: number;
  value: number;
}

export interface TimestampPrice {
  timestamp: number;
  price: number;
}

export interface OHLCInput {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

/** Convert {timestamp, value} points to lightweight-charts LineData */
export function toLineDataFromValues(data: TimestampValue[]): LineData<Time>[] {
  return data.map((d) => ({
    time: (d.timestamp / 1000) as Time,
    value: d.value,
  }));
}

/** Convert {timestamp, price} points to lightweight-charts LineData */
export function toLineDataFromPrices(data: TimestampPrice[]): LineData<Time>[] {
  return data.map((d) => ({
    time: (d.timestamp / 1000) as Time,
    value: d.price,
  }));
}

/** Convert OHLC data to lightweight-charts CandlestickData */
export function toCandlestickData(data: OHLCInput[]): CandlestickData<Time>[] {
  return data.map((d) => ({
    time: (d.timestamp / 1000) as Time,
    open: d.open,
    high: d.high,
    low: d.low,
    close: d.close,
  }));
}

/** Group timestamped values into candlestick data (for portfolio chart) */
export function groupIntoCandlesticks(
  data: TimestampValue[],
  numCandles = 40
): CandlestickData<Time>[] {
  const candleSize = Math.max(2, Math.floor(data.length / numCandles));
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
