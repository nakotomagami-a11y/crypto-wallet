export type NetworkId = "ethereum" | "solana";

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  symbol: string;
  decimals: number;
  rpcUrl: string;
  explorerUrl: string;
  iconPath: string;
}

export interface Account {
  address: string;
  network: NetworkId;
}

export interface WalletState {
  isLocked: boolean;
  ethAddress: string | null;
  solAddress: string | null;
  activeNetwork: NetworkId;
}

export interface EncryptedVault {
  ciphertext: string;
  iv: string;
  salt: string;
}
