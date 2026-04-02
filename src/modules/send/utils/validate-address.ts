import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import type { NetworkId } from "@/types/wallet";

export function validateAddress(
  address: string,
  network: NetworkId
): { valid: boolean; error?: string } {
  if (!address.trim()) {
    return { valid: false, error: "Address is required" };
  }

  if (network === "ethereum") {
    try {
      ethers.getAddress(address);
      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid Ethereum address" };
    }
  }

  if (network === "solana") {
    try {
      new PublicKey(address);
      return { valid: true };
    } catch {
      return { valid: false, error: "Invalid Solana address" };
    }
  }

  return { valid: false, error: "Unknown network" };
}
