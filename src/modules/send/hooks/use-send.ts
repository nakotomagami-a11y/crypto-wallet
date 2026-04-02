"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { deriveEthWallet, deriveSolWallet } from "@/modules/wallet/utils/derive";
import { CHAINS } from "@/lib/chains";
import type { NetworkId } from "@/types/wallet";

interface SendParams {
  to: string;
  amount: string;
  network: NetworkId;
}

async function sendEthTransaction(
  to: string,
  amount: string,
  mnemonic: string
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(CHAINS.ethereum.rpcUrl);
  const { privateKey } = deriveEthWallet(mnemonic);
  const wallet = new ethers.Wallet(privateKey, provider);
  const tx = await wallet.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  await tx.wait();
  return tx.hash;
}

async function sendSolTransaction(
  to: string,
  amount: string,
  mnemonic: string
): Promise<string> {
  const connection = new Connection(CHAINS.solana.rpcUrl, "confirmed");
  const { privateKey } = deriveSolWallet(mnemonic);
  const keypair = Keypair.fromSecretKey(
    Uint8Array.from(Buffer.from(privateKey, "hex"))
  );
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(to),
      lamports: Math.round(parseFloat(amount) * LAMPORTS_PER_SOL),
    })
  );
  const signature = await connection.sendTransaction(transaction, [keypair]);
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

export function useSend() {
  const { mnemonic } = useWalletStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ to, amount, network }: SendParams) => {
      if (!mnemonic) throw new Error("Wallet is locked");

      if (network === "ethereum") {
        return sendEthTransaction(to, amount, mnemonic);
      }
      return sendSolTransaction(to, amount, mnemonic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["balances"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
