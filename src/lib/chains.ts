import type { NetworkConfig, NetworkId } from "@/types/wallet";

export const CHAINS: Record<NetworkId, NetworkConfig> = {
  ethereum: {
    id: "ethereum",
    name: "Ethereum Sepolia",
    symbol: "ETH",
    decimals: 18,
    rpcUrl:
      process.env.NEXT_PUBLIC_ETH_RPC_URL ||
      "https://ethereum-sepolia-rpc.publicnode.com",
    explorerUrl: "https://sepolia.etherscan.io",
    iconPath: "/icons/eth.svg",
  },
  solana: {
    id: "solana",
    name: "Solana Devnet",
    symbol: "SOL",
    decimals: 9,
    rpcUrl:
      process.env.NEXT_PUBLIC_SOL_RPC_URL ||
      "https://api.devnet.solana.com",
    explorerUrl: "https://explorer.solana.com",
    iconPath: "/icons/sol.svg",
  },
};

export const USDC_ADDRESSES: Partial<Record<NetworkId, string>> = {
  ethereum: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238", // Sepolia USDC
};

export const DEFAULT_NETWORK: NetworkId = "ethereum";
