import type { NetworkId } from "./wallet";

export interface NFT {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  collection: string;
  network: NetworkId;
  tokenId: string;
  contractAddress: string;
}
