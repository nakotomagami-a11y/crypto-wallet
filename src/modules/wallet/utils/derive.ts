import * as bip39 from "bip39";
import { ethers } from "ethers";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { ETH_DERIVATION_PATH, SOL_DERIVATION_PATH, ethDerivationPath, solDerivationPath } from "./constants";

export function generateMnemonic(): string {
  return bip39.generateMnemonic();
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic.trim().toLowerCase());
}

export function deriveEthWallet(mnemonic: string, accountIndex = 0) {
  const path = accountIndex === 0 ? ETH_DERIVATION_PATH : ethDerivationPath(accountIndex);
  const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic, undefined, path);
  return {
    address: hdNode.address,
    privateKey: hdNode.privateKey,
  };
}

export function deriveSolWallet(mnemonic: string, accountIndex = 0) {
  const path = accountIndex === 0 ? SOL_DERIVATION_PATH : solDerivationPath(accountIndex);
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const derived = derivePath(path, seed.toString("hex"));
  const keypair = Keypair.fromSeed(derived.key);
  return {
    address: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString("hex"),
  };
}

export function deriveAllAccounts(mnemonic: string, accountIndex = 0) {
  const eth = deriveEthWallet(mnemonic, accountIndex);
  const sol = deriveSolWallet(mnemonic, accountIndex);
  return { eth, sol };
}
