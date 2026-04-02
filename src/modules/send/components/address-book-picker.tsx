"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddressBook, type SavedAddress } from "@/modules/wallet/hooks/use-address-book";
import { toast } from "sonner";
import type { NetworkId } from "@/types/wallet";

interface AddressBookPickerProps {
  network: NetworkId;
  onSelect: (address: string) => void;
  currentAddress: string;
}

export function AddressBookPicker({ network, onSelect, currentAddress }: AddressBookPickerProps) {
  const { getByNetwork, addAddress, removeAddress } = useAddressBook();
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const saved = getByNetwork(network);

  function handleSaveCurrent() {
    if (!currentAddress.trim() || !newLabel.trim()) return;
    addAddress({ label: newLabel.trim(), address: currentAddress.trim(), network });
    toast.success(`Saved "${newLabel.trim()}" to address book`);
    setNewLabel("");
    setShowAdd(false);
  }

  function handleRemove(entry: SavedAddress) {
    removeAddress(entry.address, entry.network);
    toast.success(`Removed "${entry.label}" from address book`);
  }

  return (
    <div className="space-y-2">
      {saved.length > 0 && (
        <div>
          <Label className="text-xs text-muted-foreground">Saved Addresses</Label>
          <div className="mt-1 space-y-1">
            {saved.map((entry) => (
              <div
                key={entry.address}
                className="flex items-center gap-2 rounded-lg border border-[var(--outline-dim)] px-3 py-2 transition-colors hover:border-[var(--outline)]"
              >
                <button
                  onClick={() => onSelect(entry.address)}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-xs font-medium truncate">{entry.label}</p>
                  <p className="font-mono text-[10px] text-muted-foreground truncate">
                    {entry.address}
                  </p>
                </button>
                <button
                  onClick={() => handleRemove(entry)}
                  className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  title="Remove"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd ? (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label htmlFor="address-label" className="text-xs">Label</Label>
            <Input
              id="address-label"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="e.g. My other wallet"
              className="h-8 text-xs"
            />
          </div>
          <Button size="sm" onClick={handleSaveCurrent} disabled={!newLabel.trim() || !currentAddress.trim()}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          + Save this address
        </button>
      )}
    </div>
  );
}
