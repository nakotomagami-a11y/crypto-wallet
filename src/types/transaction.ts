import type { NetworkId } from "./wallet";

export interface TokenBalance {
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  network: NetworkId;
  contractAddress?: string;
  usdValue?: number;
}

export enum TransactionStatus {
  Confirmed = "confirmed",
  Pending = "pending",
  Failed = "failed",
}

export enum TransactionDirection {
  Sent = "sent",
  Received = "received",
}

export interface Transaction {
  hash: string;
  network: NetworkId;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  status: TransactionStatus;
  direction: TransactionDirection;
  explorerUrl: string;
}
