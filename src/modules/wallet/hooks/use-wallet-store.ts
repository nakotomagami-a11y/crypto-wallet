import { create } from "zustand";
import type { NetworkId } from "@/types/wallet";
import { DEFAULT_NETWORK } from "@/lib/chains";
import { DEMO_ETH_ADDRESS, DEMO_SOL_ADDRESS } from "@/lib/constants";

interface WalletStore {
  isLocked: boolean;
  isDemo: boolean;
  activeNetwork: NetworkId;
  ethAddress: string | null;
  solAddress: string | null;
  mnemonic: string | null;

  setUnlocked: (ethAddress: string, solAddress: string, mnemonic: string) => void;
  setDemo: () => void;
  lock: () => void;
  setNetwork: (network: NetworkId) => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  isLocked: true,
  isDemo: false,
  activeNetwork: DEFAULT_NETWORK,
  ethAddress: null,
  solAddress: null,
  mnemonic: null,

  setUnlocked: (ethAddress, solAddress, mnemonic) =>
    set({ isLocked: false, isDemo: false, ethAddress, solAddress, mnemonic }),

  setDemo: () =>
    set({
      isLocked: false,
      isDemo: true,
      ethAddress: DEMO_ETH_ADDRESS,
      solAddress: DEMO_SOL_ADDRESS,
      mnemonic: null,
    }),

  lock: () =>
    set({ isLocked: true, isDemo: false, ethAddress: null, solAddress: null, mnemonic: null }),

  setNetwork: (network) => set({ activeNetwork: network }),
}));
