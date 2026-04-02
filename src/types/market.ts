export interface TokenSearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number | null;
}

export interface TokenDetail {
  id: string;
  name: string;
  symbol: string;
  image: string;
  currentPrice: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCap: number;
  totalVolume: number;
  high24h: number;
  low24h: number;
}

export interface OHLCDataPoint {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface PricePoint {
  timestamp: number;
  price: number;
}

export enum ChartInterval {
  Day = "1",
  Week = "7",
  Month = "30",
  Year = "365",
}

export enum ChartType {
  Line = "line",
  Candle = "candle",
}
