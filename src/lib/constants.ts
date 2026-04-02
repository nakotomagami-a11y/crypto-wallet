// ═══════════════════════════════════════════════════════════════
// Blockchain constants — program IDs, token lists, ABIs.
// Keep all hardcoded blockchain values here for easy management.
// ═══════════════════════════════════════════════════════════════

// ─── Solana Program IDs ────────────────────────────────────────

/** Metaplex Token Metadata program */
export const METAPLEX_TOKEN_METADATA_PROGRAM = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";

/** SPL Token program */
export const SPL_TOKEN_PROGRAM = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

// ─── Known Sepolia ERC-20 Tokens ───────────────────────────────

export interface KnownToken {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
}

export const SEPOLIA_ERC20_TOKENS: KnownToken[] = [
  { address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", name: "USD Coin", symbol: "USDC", decimals: 6 },
  { address: "0x7169D38820dfd117C3FA1f22a697dBA58d90BA06", name: "Dai Stablecoin", symbol: "DAI", decimals: 18 },
  { address: "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0", name: "Tether USD", symbol: "USDT", decimals: 6 },
  { address: "0x779877A7B0D9E8603169DdbD7836e478b4624789", name: "Chainlink", symbol: "LINK", decimals: 18 },
];

// ─── ERC-20 ABIs ───────────────────────────────────────────────

export const ERC20_READ_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
];

export const ERC20_TRANSFER_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
];

// ─── Demo Wallet Addresses ─────────────────────────────────────

export const DEMO_ETH_ADDRESS = "0x388C818CA8B9251b393131C08a736A67ccB19297";
export const DEMO_SOL_ADDRESS = "vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg";

// ─── Limits ────────────────────────────────────────────────────

/** Max SPL tokens to display per wallet */
export const MAX_SPL_TOKENS = 20;
