import type { NetworkId } from "@/types/wallet";

export const queryKeys = {
  balances: (address: string, network: NetworkId) =>
    ["balances", network, address] as const,
  allBalances: (ethAddress: string | null, solAddress: string | null) =>
    ["balances", ethAddress, solAddress] as const,
  transactions: (address: string, network: NetworkId) =>
    ["transactions", network, address] as const,
  gasEstimate: (network: NetworkId, to: string, amount: string) =>
    ["gas", network, to, amount] as const,
  tokenSearch: (query: string) =>
    ["tokenSearch", query] as const,
  tokenDetail: (id: string) =>
    ["tokenDetail", id] as const,
  tokenChart: (id: string, days: string, type: string) =>
    ["tokenChart", id, days, type] as const,
};
