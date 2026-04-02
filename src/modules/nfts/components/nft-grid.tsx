"use client";

import { useNFTs } from "@/modules/nfts/hooks/use-nfts";
import { NFTCard } from "./nft-card";

export function NFTGrid() {
  const { nfts, isLoading, error } = useNFTs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-2xl bg-[rgba(255,255,255,0.04)]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Failed to load NFTs. Try again later.
        </p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="glass-card rounded-2xl py-16 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-muted-foreground"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
        <p className="text-sm font-medium">No NFTs found</p>
        <p className="text-xs text-muted-foreground mt-1">
          NFTs in your wallet will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {nfts.map((nft) => (
        <NFTCard key={nft.id} nft={nft} />
      ))}
    </div>
  );
}
