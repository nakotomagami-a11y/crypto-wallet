"use client";

import { useQuery } from "@tanstack/react-query";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { EXTERNAL_API } from "@/lib/routes";
import { CHAINS } from "@/lib/chains";
import type { NFT } from "@/types/nft";

interface BlockscoutNFTItem {
  token: {
    address: string;
    name: string;
    type: string;
  };
  id: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
  };
  image_url?: string;
}

interface SolanaDASAsset {
  id: string;
  content?: {
    metadata?: { name?: string; description?: string };
    links?: { image?: string };
    json_uri?: string;
  };
  grouping?: Array<{ group_key: string; group_value: string }>;
}

async function fetchEthNFTs(address: string): Promise<NFT[]> {
  const res = await fetch(EXTERNAL_API.blockscout.sepoliaNfts(address));
  if (!res.ok) return [];
  const json = await res.json();
  const items: BlockscoutNFTItem[] = json.items ?? [];

  return items.map((item) => ({
    id: `eth-${item.token.address}-${item.id}`,
    name: item.metadata?.name ?? `#${item.id}`,
    description: item.metadata?.description ?? "",
    imageUrl: item.image_url ?? item.metadata?.image ?? "",
    collection: item.token.name ?? "Unknown Collection",
    network: "ethereum" as const,
    tokenId: item.id,
    contractAddress: item.token.address,
  }));
}

async function fetchSolNFTs(address: string): Promise<NFT[]> {
  const res = await fetch(CHAINS.solana.rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getAssetsByOwner",
      params: { ownerAddress: address, page: 1, limit: 50 },
    }),
  });
  if (!res.ok) return [];
  const json = await res.json();
  const items: SolanaDASAsset[] = json.result?.items ?? [];

  return items
    .filter((item) => item.content?.links?.image)
    .map((item) => {
      const collection = item.grouping?.find((g) => g.group_key === "collection")?.group_value ?? "";
      return {
        id: `sol-${item.id}`,
        name: item.content?.metadata?.name ?? "Solana NFT",
        description: item.content?.metadata?.description ?? "",
        imageUrl: item.content?.links?.image ?? "",
        collection,
        network: "solana" as const,
        tokenId: item.id,
        contractAddress: collection,
      };
    });
}

export function useNFTs() {
  const { ethAddress, solAddress } = useWalletStore();

  const ethQuery = useQuery({
    queryKey: ["nfts", "ethereum", ethAddress],
    queryFn: () => fetchEthNFTs(ethAddress!),
    enabled: !!ethAddress,
    staleTime: 60_000,
  });

  const solQuery = useQuery({
    queryKey: ["nfts", "solana", solAddress],
    queryFn: () => fetchSolNFTs(solAddress!),
    enabled: !!solAddress,
    staleTime: 60_000,
  });

  const allNfts = [...(ethQuery.data ?? []), ...(solQuery.data ?? [])];
  const isLoading =
    (!!ethAddress && ethQuery.isPending) || (!!solAddress && solQuery.isPending);

  return {
    nfts: allNfts,
    isLoading,
    error: ethQuery.error || solQuery.error,
  };
}
