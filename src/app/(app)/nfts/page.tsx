"use client";

import { NFTGrid } from "@/modules/nfts/components/nft-grid";

export default function NFTsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">NFTs</h1>
      <NFTGrid />
    </div>
  );
}
