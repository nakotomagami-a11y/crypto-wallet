"use client";


import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import type { NetworkId } from "@/types/wallet";
import { CHAINS } from "@/lib/chains";

const NETWORKS: NetworkId[] = ["ethereum", "solana"];

export function NetworkSelector() {
  const { activeNetwork, setNetwork } = useWalletStore();

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-6 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Active Network
        </h3>
        <div className="space-y-2">
          {NETWORKS.map((id) => {
            const chain = CHAINS[id];
            const isActive = id === activeNetwork;
            return (
              <button
                key={id}
                onClick={() => setNetwork(id)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                  isActive
                    ? "border-primary bg-accent"
                    : "hover:bg-accent/50"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      id === "ethereum" ? "#627EEA" : "#9945FF",
                  }}
                />
                <div>
                  <p className="text-sm font-medium">{chain.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {chain.symbol} &middot; Testnet
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
