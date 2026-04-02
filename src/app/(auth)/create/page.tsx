"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MnemonicDisplay } from "@/modules/wallet/components/mnemonic-display";
import { PasswordForm } from "@/modules/wallet/components/password-form";
import { useWallet } from "@/modules/wallet/hooks/use-wallet";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";

type Step = "password" | "mnemonic";

export default function CreatePage() {
  const [step, setStep] = useState<Step>("password");
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { createWallet } = useWallet();
  const { setDemo } = useWalletStore();
  const router = useRouter();

  async function handlePassword(password: string) {
    try {
      setLoading(true);
      setError(null);
      const m = await createWallet(password);
      setMnemonic(m);
      setStep("mnemonic");
    } catch {
      setError("Failed to create wallet");
    } finally {
      setLoading(false);
    }
  }

  function handleMnemonicConfirm() {
    router.push("/dashboard");
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-6">
        {step === "password" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Create New Wallet</h3>
              <p className="text-sm text-muted-foreground">
                Set a password to encrypt your wallet locally.
              </p>
            </div>
            <PasswordForm
              onSubmit={handlePassword}
              confirmPassword
              submitLabel="Create Wallet"
              error={error}
              loading={loading}
            />
          </div>
        )}

        {step === "mnemonic" && mnemonic && (
          <MnemonicDisplay
            mnemonic={mnemonic}
            onConfirm={handleMnemonicConfirm}
          />
        )}
      </div>

      <div className="px-6 pb-6 space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setDemo();
            router.push("/dashboard");
          }}
        >
          Try Demo Mode
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Already have a wallet?{" "}
          <Link href="/import" className="text-primary underline">
            Import
          </Link>
        </p>
      </div>
    </div>
  );
}
