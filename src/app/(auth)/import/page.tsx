"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MnemonicInput } from "@/modules/wallet/components/mnemonic-input";
import { PasswordForm } from "@/modules/wallet/components/password-form";
import { useWallet } from "@/modules/wallet/hooks/use-wallet";
import { PAGE_ROUTES } from "@/lib/routes";

type Step = "mnemonic" | "password";

export default function ImportPage() {
  const [step, setStep] = useState<Step>("mnemonic");
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { importWallet } = useWallet();
  const router = useRouter();

  function handleMnemonic(m: string) {
    setMnemonic(m);
    setStep("password");
  }

  async function handlePassword(password: string) {
    try {
      setLoading(true);
      setError(null);
      await importWallet(mnemonic, password);
      router.push(PAGE_ROUTES.dashboard);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to import wallet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-6">
        {step === "mnemonic" && (
          <MnemonicInput onSubmit={handleMnemonic} error={error} />
        )}

        {step === "password" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Set Password</h3>
              <p className="text-sm text-muted-foreground">
                Set a password to encrypt your imported wallet.
              </p>
            </div>
            <PasswordForm
              onSubmit={handlePassword}
              confirmPassword
              submitLabel="Import Wallet"
              error={error}
              loading={loading}
            />
          </div>
        )}
      </div>

      <div className="px-6 pb-6 text-center text-sm text-muted-foreground">
        Want to create a new wallet?{" "}
        <Link href={PAGE_ROUTES.create} className="text-primary underline">
          Create
        </Link>
      </div>
    </div>
  );
}
