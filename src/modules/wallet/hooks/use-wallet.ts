"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "./use-wallet-store";
import {
  generateMnemonic,
  validateMnemonic,
  deriveAllAccounts,
} from "../utils/derive";
import {
  encryptMnemonic,
  decryptMnemonic,
  saveVault,
  loadVault,
  clearVault,
} from "../utils/crypto";

export function useWallet() {
  const router = useRouter();
  const store = useWalletStore();

  const createWallet = useCallback(
    async (password: string) => {
      const mnemonic = generateMnemonic();
      const { eth, sol } = deriveAllAccounts(mnemonic);
      const vault = await encryptMnemonic(mnemonic, password);
      saveVault(vault);
      store.setUnlocked(eth.address, sol.address, mnemonic);
      return mnemonic;
    },
    [store]
  );

  const importWallet = useCallback(
    async (mnemonic: string, password: string) => {
      const trimmed = mnemonic.trim().toLowerCase();
      if (!validateMnemonic(trimmed)) {
        throw new Error("Invalid mnemonic phrase");
      }
      const { eth, sol } = deriveAllAccounts(trimmed);
      const vault = await encryptMnemonic(trimmed, password);
      saveVault(vault);
      store.setUnlocked(eth.address, sol.address, trimmed);
    },
    [store]
  );

  const unlock = useCallback(
    async (password: string) => {
      const vault = loadVault();
      if (!vault) throw new Error("No wallet found");
      const mnemonic = await decryptMnemonic(vault, password);
      const { eth, sol } = deriveAllAccounts(mnemonic);
      store.setUnlocked(eth.address, sol.address, mnemonic);
    },
    [store]
  );

  const lock = useCallback(() => {
    store.lock();
    router.push("/unlock");
  }, [store, router]);

  const exportMnemonic = useCallback(
    async (password: string): Promise<string> => {
      const vault = loadVault();
      if (!vault) throw new Error("No wallet found");
      return decryptMnemonic(vault, password);
    },
    []
  );

  const resetWallet = useCallback(() => {
    clearVault();
    store.lock();
    router.push("/create");
  }, [store, router]);

  return {
    ...store,
    createWallet,
    importWallet,
    unlock,
    lock,
    exportMnemonic,
    resetWallet,
  };
}
