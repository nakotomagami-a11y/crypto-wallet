# Vault — Crypto Wallet Demo

> **WARNING: This is a demonstration project for portfolio purposes only. It is NOT intended for production use, real funds, or mainnet transactions. Do not store real cryptocurrency or private keys with this application. Use at your own risk.**

A portfolio-ready crypto wallet supporting **Ethereum (Sepolia)** and **Solana (Devnet)**. Fully client-side — no backend required. Keys are derived locally and encrypted with AES-GCM before storing in localStorage.

## Features

- **Multi-chain** — Ethereum and Solana from a single BIP-39 mnemonic
- **Create / Import / Unlock** — Generate a new wallet or import an existing 12-word recovery phrase
- **Send transactions** — Build, sign, and broadcast on either chain
- **Receive** — Display addresses with QR codes and one-click copy
- **Transaction history** — View recent activity via Blockscout API and Solana RPC, click-to-copy tx hashes
- **Market data** — Search tokens, view prices, and interactive charts (line + candlestick) via CoinGecko API
- **Token balances** — Displays native + ERC-20 / SPL token balances with live USD values and 24h change
- **Encrypted storage** — AES-GCM encryption with PBKDF2 key derivation (600k iterations)
- **Network switching** — Toggle between Ethereum Sepolia and Solana Devnet
- **Light / Dark mode** — Theme toggle with genys-inspired design system
- **Demo mode** — One-click demo with pre-funded testnet addresses
- **Faucet links** — Quick access to Sepolia ETH and Devnet SOL faucets from dashboard
- **Address book** — Save, select, and remove frequently used recipient addresses (persisted in localStorage)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | shadcn/ui + Tailwind CSS + custom glass theme |
| Ethereum | ethers.js v6 |
| Solana | @solana/web3.js |
| Key derivation | bip39 + ed25519-hd-key |
| State | Zustand (UI) + React Query (network data) |
| Encryption | Web Crypto API (AES-GCM) |
| Market data | CoinGecko API |
| Transaction history | Blockscout API (ETH) + Solana RPC (SOL) |
| Charts | Custom SVG (line + candlestick) |

## Architecture

Modular feature-based architecture inspired by production-grade patterns:

```
src/
├── app/              # Next.js App Router (pages + layouts)
│   ├── (auth)/       # Create, Import, Unlock (unauthenticated)
│   └── (app)/        # Dashboard, Send, Receive, Activity, Market, Settings
├── modules/          # Feature modules
│   ├── wallet/       # Core: key derivation, encryption, state
│   ├── portfolio/    # Balance fetching, token list, formatting
│   ├── send/         # Transaction building and broadcasting
│   ├── receive/      # Address display and QR codes
│   ├── activity/     # Transaction history (Blockscout + Solana RPC)
│   ├── market/       # Token search, price data, charts (CoinGecko)
│   └── settings/     # Network selection, export, reset
├── components/       # Shared UI (shadcn) + layout components
├── hooks/            # App-level hooks (theme)
├── lib/              # Providers, chain configs, query keys, utils
└── types/            # Shared TypeScript types and enums
```

**Key patterns:**
- Components are JSX-only — all logic lives in hooks
- Data fetching goes through React Query — no raw fetch in components
- Zustand holds UI state only (active network, lock status)
- Centralized chain configs and query keys
- Enums for transaction status/direction and chart interval/type

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000 — you'll be prompted to create a new wallet or click **Try Demo Mode** to explore with pre-funded testnet addresses.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ETH_RPC_URL` | Ethereum Sepolia RPC | `https://ethereum-sepolia-rpc.publicnode.com` |
| `NEXT_PUBLIC_SOL_RPC_URL` | Solana Devnet RPC | `https://api.devnet.solana.com` |

### Testnet Faucets

To test with real testnet tokens:
- **Sepolia ETH**: https://www.alchemy.com/faucets/ethereum-sepolia
- **Devnet SOL**: https://faucet.solana.com/

## Disclaimer

This project is built strictly for **educational and portfolio demonstration purposes**.

- **DO NOT** use this wallet with real cryptocurrency or on mainnet networks
- **DO NOT** store real private keys or seed phrases in this application
- **DO NOT** rely on this for any financial transactions involving real value
- The encryption and key management, while technically sound, have **not been professionally audited**
- Private keys exist in browser memory during active sessions
- localStorage is not a secure key store for production use

This project demonstrates knowledge of blockchain development concepts including key derivation (BIP-39/BIP-44), transaction signing, multi-chain architecture, and Web3 integration patterns. It is meant to showcase engineering skills, not to serve as a production wallet.

## Security — Demo vs Production

| Aspect | This Demo | Production |
|--------|-----------|------------|
| Key storage | localStorage + AES-GCM | Hardware-backed keystore / HSM |
| Key memory | In-memory during session | Cleared after each signing |
| Mnemonic backup | No verification step | Verified re-entry required |
| Networks | Testnet only | Mainnet with confirmation dialogs |
| Audit | None | Professional security audit |
| Hardware wallets | Not supported | Ledger/Trezor integration |
| CSP / XSS protection | Basic | Hardened Content Security Policy |

## Key Derivation Paths

- **Ethereum**: `m/44'/60'/0'/0/0`
- **Solana**: `m/44'/501'/0'/0'`

Both derived from the same BIP-39 mnemonic, matching industry-standard wallet implementations (MetaMask, Phantom, etc.).
