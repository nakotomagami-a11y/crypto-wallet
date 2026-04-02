export const ETH_DERIVATION_PATH = "m/44'/60'/0'/0/0";
export const SOL_DERIVATION_PATH = "m/44'/501'/0'/0'";

export function ethDerivationPath(accountIndex: number): string {
  return `m/44'/60'/0'/0/${accountIndex}`;
}

export function solDerivationPath(accountIndex: number): string {
  return `m/44'/501'/${accountIndex}'/0'`;
}
export const VAULT_STORAGE_KEY = "crypto-wallet-vault";
export const PBKDF2_ITERATIONS = 600_000;
