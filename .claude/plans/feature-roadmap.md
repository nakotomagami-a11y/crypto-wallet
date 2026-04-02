# Feature Roadmap — 1 Feature = 1 PR

Each feature gets its own branch, PR, and review cycle. Only proceed to next after merge.

---

## Feature 1: Copy Transaction Hash
**Branch:** `feat/copy-tx-hash`
**Scope:** Add click-to-copy on tx hashes in activity page + toast confirmation
**Files:** `modules/activity/components/transaction-row.tsx`

## Feature 2: Faucet Links
**Branch:** `feat/faucet-links`
**Scope:** "Get testnet tokens" buttons on dashboard linking to Sepolia ETH faucet and Solana Devnet faucet
**Files:** `app/(app)/dashboard/page.tsx` or new `modules/portfolio/components/faucet-links.tsx`

## Feature 3: Address Book
**Branch:** `feat/address-book`
**Scope:** Save/edit/delete recipient addresses in localStorage. Dropdown on send page to pick saved addresses
**Files:** New `modules/wallet/hooks/use-address-book.ts`, new `modules/send/components/address-book.tsx`, modify `modules/send/components/send-form.tsx`

## Feature 4: USD Prices on Balance Cards
**Branch:** `feat/usd-prices`
**Scope:** Fetch ETH/SOL USD prices from CoinGecko, display dollar values on balance cards and token list
**Files:** New `modules/portfolio/hooks/use-prices.ts`, modify `modules/portfolio/components/balance-card.tsx`, `token-list.tsx`

## Feature 6: NFT Gallery
**Branch:** `feat/nft-gallery`
**Scope:** New `/nfts` page. Fetch NFTs from Blockscout (ETH) and Helius DAS API (SOL). Grid display with images
**Files:** New `modules/nfts/` module (components, hooks), new `app/(app)/nfts/page.tsx`, sidebar update

## Feature 7: Portfolio Chart
**Branch:** `feat/portfolio-chart`
**Scope:** Total portfolio value over time chart on dashboard. Combine ETH+SOL price history weighted by balances
**Files:** New `modules/portfolio/components/portfolio-chart.tsx`, new `modules/portfolio/hooks/use-portfolio-history.ts`, modify dashboard page

## Feature 8: Token Transfer (ERC-20 Send)
**Branch:** `feat/token-transfer`
**Scope:** Extend send page with token selector dropdown. Support sending ERC-20 tokens in addition to native ETH/SOL
**Files:** Modify `modules/send/components/send-form.tsx`, modify `modules/send/hooks/use-send.ts`, new `modules/send/components/token-selector.tsx`

## Feature 9: Gas Fee Estimator
**Branch:** `feat/gas-estimator`
**Scope:** Show estimated gas fee (ETH) or priority fee (SOL) on send page before confirming. Updates as user types
**Files:** New `modules/send/hooks/use-gas-estimate.ts`, new/modify `modules/send/components/gas-estimator.tsx`, modify send-form

## Feature 10: Transaction Filters
**Branch:** `feat/tx-filters`
**Scope:** Filter activity by sent/received, network, and date range. Persistent filter state
**Files:** New `modules/activity/components/transaction-filters.tsx`, modify `modules/activity/components/transaction-list.tsx`

## Feature 11: Watchlist
**Branch:** `feat/watchlist`
**Scope:** Save tokens from market page to a watchlist (localStorage). Show watched token prices on dashboard
**Files:** New `modules/market/hooks/use-watchlist.ts`, new `modules/market/components/watchlist-button.tsx`, new `modules/portfolio/components/watchlist-card.tsx`, modify dashboard + market detail pages

## Feature 12: Export Transactions CSV
**Branch:** `feat/export-csv`
**Scope:** Download button on activity page that exports all visible transactions as CSV
**Files:** New `modules/activity/utils/export-csv.ts`, modify `modules/activity/components/transaction-list.tsx`

## Feature 13: Multi-Account
**Branch:** `feat/multi-account`
**Scope:** Derive multiple accounts from same mnemonic (index 0, 1, 2...). Account selector in sidebar/header. Each account has its own ETH+SOL addresses
**Files:** Modify `modules/wallet/utils/derive.ts`, modify `modules/wallet/hooks/use-wallet-store.ts`, new `modules/wallet/components/account-selector.tsx`, modify header/sidebar

---

## Execution Order
1 → 2 → 3 → 4 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 13

Ready to start with Feature 1 when you give the go.
