"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordForm } from "@/modules/wallet/components/password-form";
import { useWallet } from "@/modules/wallet/hooks/use-wallet";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { PAGE_ROUTES } from "@/lib/routes";

export default function UnlockPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { unlock } = useWallet();
  const { setDemo } = useWalletStore();
  const router = useRouter();

  async function handleUnlock(password: string) {
    try {
      setLoading(true);
      setError(null);
      await unlock(password);
      router.push(PAGE_ROUTES.dashboard);
    } catch {
      setError("Wrong password or corrupted vault");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Unlock Wallet</h3>
          <p className="text-sm text-muted-foreground">
            Enter your password to decrypt your wallet.
          </p>
        </div>
        <PasswordForm
          onSubmit={handleUnlock}
          submitLabel="Unlock"
          error={error}
          loading={loading}
        />
      </div>

      <div className="px-6 pb-6 space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setDemo();
            router.push(PAGE_ROUTES.dashboard);
          }}
        >
          Try Demo Mode
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Want to start fresh?{" "}
          <Link href={PAGE_ROUTES.create} className="text-primary underline">
            Create new wallet
          </Link>
        </p>
      </div>
    </div>
  );
}
