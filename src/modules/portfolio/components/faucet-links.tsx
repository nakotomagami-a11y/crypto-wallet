"use client";

const FAUCETS = [
  {
    name: "Sepolia ETH",
    url: "https://www.alchemy.com/faucets/ethereum-sepolia",
    color: "#627EEA",
    symbol: "ETH",
  },
  {
    name: "Devnet SOL",
    url: "https://faucet.solana.com/",
    color: "#9945FF",
    symbol: "SOL",
  },
];

export function FaucetLinks() {
  return (
    <div className="glass-card rounded-2xl p-5">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Get Testnet Tokens
      </h2>
      <div className="flex gap-3">
        {FAUCETS.map((faucet) => (
          <a
            key={faucet.symbol}
            href={faucet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center gap-2.5 rounded-xl border border-[var(--outline-dim)] px-4 py-3 transition-all duration-200 hover:border-[var(--outline)] hover:bg-[rgba(255,255,255,0.03)]"
          >
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-white text-xs font-bold"
              style={{ backgroundColor: faucet.color }}
            >
              {faucet.symbol.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium">{faucet.name}</p>
              <p className="text-xs text-muted-foreground">Free faucet</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
