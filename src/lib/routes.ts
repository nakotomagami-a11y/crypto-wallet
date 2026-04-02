// ═══════════════════════════════════════════════════════════════
// Centralized routes — no hardcoded URLs anywhere else.
// Import from here when linking to pages or calling external APIs.
// ═══════════════════════════════════════════════════════════════

// ─── Page Routes ───────────────────────────────────────────────

export const PAGE_ROUTES = {
  home: "/",
  // Auth
  create: "/create",
  import: "/import",
  unlock: "/unlock",
  // App
  dashboard: "/dashboard",
  send: "/send",
  receive: "/receive",
  activity: "/activity",
  market: "/market",
  marketToken: (id: string) => `/market/${id}`,
  settings: "/settings",
  nfts: "/nfts",
} as const;

// ─── External APIs ─────────────────────────────────────────────

export const EXTERNAL_API = {
  coingecko: {
    base: "https://api.coingecko.com/api/v3",
    search: (query: string) =>
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`,
    coinDetail: (id: string) =>
      `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    ohlc: (id: string, days: string) =>
      `https://api.coingecko.com/api/v3/coins/${id}/ohlc?vs_currency=usd&days=${days}`,
    marketChart: (id: string, days: string) =>
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    simplePrice: (ids: string) =>
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  },
  blockscout: {
    sepoliaTransactions: (address: string) =>
      `https://eth-sepolia.blockscout.com/api/v2/addresses/${address}/transactions`,
    sepoliaNfts: (address: string) =>
      `https://eth-sepolia.blockscout.com/api/v2/addresses/${address}/nft?type=ERC-721`,
  },
  solscan: {
    transaction: (signature: string) =>
      `https://solscan.io/tx/${signature}?cluster=devnet`,
    account: (address: string) =>
      `https://solscan.io/account/${address}?cluster=devnet`,
  },
  etherscan: {
    address: (address: string) =>
      `https://sepolia.etherscan.io/address/${address}`,
    transaction: (hash: string) =>
      `https://sepolia.etherscan.io/tx/${hash}`,
  },
  faucets: {
    sepoliaEth: "https://www.alchemy.com/faucets/ethereum-sepolia",
    devnetSol: "https://faucet.solana.com/",
  },
} as const;
