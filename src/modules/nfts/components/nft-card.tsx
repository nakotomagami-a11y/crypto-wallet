"use client";

import { useState } from "react";
import type { NFT } from "@/types/nft";

interface NFTCardProps {
  nft: NFT;
}

export function NFTCard({ nft }: NFTCardProps) {
  const [imgError, setImgError] = useState(false);
  const networkColor = nft.network === "ethereum" ? "#627EEA" : "#9945FF";

  return (
    <div className="glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-200">
      <div className="aspect-square bg-[rgba(255,255,255,0.03)] relative">
        {nft.imageUrl && !imgError ? (
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
        )}
        <div
          className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: networkColor }}
          title={nft.network === "ethereum" ? "Ethereum" : "Solana"}
        />
      </div>
      <div className="p-3.5">
        <p className="text-sm font-medium truncate">{nft.name}</p>
        <p className="text-xs text-muted-foreground truncate">{nft.collection || "No collection"}</p>
      </div>
    </div>
  );
}
