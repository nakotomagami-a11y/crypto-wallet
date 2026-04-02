"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useWallet } from "@/modules/wallet/hooks/use-wallet";

export function LockWallet() {
  const { lock, resetWallet } = useWallet();
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <div className="glass-card rounded-2xl">
        <div className="p-6 space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Wallet Actions
          </h3>
          <div className="space-y-2">
            <Button variant="outline" className="w-full" onClick={lock}>
              Lock Wallet
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowReset(true)}
            >
              Reset Wallet
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showReset} onOpenChange={setShowReset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Wallet</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently delete your encrypted wallet data. Make sure
            you have backed up your recovery phrase before proceeding.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReset(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={resetWallet}>
              Yes, Reset Wallet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
