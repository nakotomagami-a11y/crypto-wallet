"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { AddressDisplay } from "@/modules/receive/components/address-display";
import { QrCode } from "@/modules/receive/components/qr-code";

export default function ReceivePage() {
  const { ethAddress, solAddress, activeNetwork } = useWalletStore();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Receive</h1>

      <Tabs defaultValue={activeNetwork}>
        <TabsList className="w-full">
          <TabsTrigger value="ethereum" className="flex-1">
            Ethereum
          </TabsTrigger>
          <TabsTrigger value="solana" className="flex-1">
            Solana
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ethereum">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {ethAddress && (
              <>
                <QrCode value={ethAddress} />
                <AddressDisplay
                  address={ethAddress}
                  label="Ethereum Address (Sepolia)"
                />
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="solana">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {solAddress && (
              <>
                <QrCode value={solAddress} />
                <AddressDisplay
                  address={solAddress}
                  label="Solana Address (Devnet)"
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
