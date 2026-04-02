"use client";

import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { CHAINS } from "@/lib/chains";

export function NetworkIndicator() {
  const { activeNetwork } = useWalletStore();
  const chain = CHAINS[activeNetwork];

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          backgroundColor: activeNetwork === "ethereum" ? "#627EEA" : "#9945FF",
        }}
      />
      {chain.name}
    </div>
  );
}
