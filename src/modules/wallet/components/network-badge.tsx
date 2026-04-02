"use client";

import { Badge } from "@/components/ui/badge";
import { CHAINS } from "@/lib/chains";
import type { NetworkId } from "@/types/wallet";

interface NetworkBadgeProps {
  network: NetworkId;
  onClick?: () => void;
}

export function NetworkBadge({ network, onClick }: NetworkBadgeProps) {
  const chain = CHAINS[network];
  return (
    <Badge
      variant="outline"
      className={`cursor-pointer gap-1.5 ${onClick ? "hover:bg-accent" : ""}`}
      onClick={onClick}
    >
      <span className="h-2 w-2 rounded-full" style={{
        backgroundColor: network === "ethereum" ? "#627EEA" : "#9945FF",
      }} />
      {chain.name}
    </Badge>
  );
}
