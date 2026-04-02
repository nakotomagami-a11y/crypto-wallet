"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// Using glass-card styling
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NetworkBadge } from "@/modules/wallet/components/network-badge";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { useSend } from "@/modules/send/hooks/use-send";
import { validateAddress } from "@/modules/send/utils/validate-address";
import { AddressBookPicker } from "@/modules/send/components/address-book-picker";
import { CHAINS } from "@/lib/chains";
import type { NetworkId } from "@/types/wallet";
import { toast } from "sonner";

export function SendForm() {
  const { activeNetwork, setNetwork } = useWalletStore();
  const sendMutation = useSend();
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chain = CHAINS[activeNetwork];

  function handleNetworkToggle() {
    const next: NetworkId =
      activeNetwork === "ethereum" ? "solana" : "ethereum";
    setNetwork(next);
  }

  function handleReview() {
    setError(null);
    const { valid, error: addrError } = validateAddress(to, activeNetwork);
    if (!valid) {
      setError(addrError ?? "Invalid address");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setShowConfirm(true);
  }

  async function handleConfirm() {
    setShowConfirm(false);
    try {
      const hash = await sendMutation.mutateAsync({
        to,
        amount,
        network: activeNetwork,
      });
      toast.success("Transaction sent!", {
        description: `Hash: ${hash.slice(0, 16)}...`,
      });
      setTo("");
      setAmount("");
    } catch (e) {
      toast.error("Transaction failed", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    }
  }

  return (
    <>
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Send</h2>
            <NetworkBadge
              network={activeNetwork}
              onClick={handleNetworkToggle}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">Recipient Address</Label>
            <Input
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={
                activeNetwork === "ethereum"
                  ? "0x..."
                  : "Enter Solana address"
              }
              className="font-mono text-sm"
            />
            <AddressBookPicker
              network={activeNetwork}
              onSelect={setTo}
              currentAddress={to}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({chain.symbol})</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={handleReview}
            className="w-full"
            disabled={sendMutation.isPending}
          >
            {sendMutation.isPending ? "Sending..." : "Review Transaction"}
          </Button>
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <span>{chain.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To</span>
              <span className="font-mono truncate max-w-[200px]">{to}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span>
                {amount} {chain.symbol}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm &amp; Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
