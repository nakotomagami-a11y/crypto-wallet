"use client";

import { NetworkSelector } from "@/modules/settings/components/network-selector";
import { ExportMnemonic } from "@/modules/settings/components/export-mnemonic";
import { LockWallet } from "@/modules/settings/components/lock-wallet";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <NetworkSelector />
      <ExportMnemonic />
      <LockWallet />
    </div>
  );
}
