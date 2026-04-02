"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWallet } from "@/modules/wallet/hooks/use-wallet";

export function ExportMnemonic() {
  const { exportMnemonic } = useWallet();
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    try {
      setLoading(true);
      setError(null);
      const m = await exportMnemonic(password);
      setMnemonic(m);
    } catch {
      setError("Wrong password");
    } finally {
      setLoading(false);
    }
  }

  function handleHide() {
    setMnemonic(null);
    setPassword("");
  }

  return (
    <div className="glass-card rounded-2xl">
      <div className="p-6 space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Export Recovery Phrase
        </h3>

        {mnemonic ? (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {mnemonic.split(" ").map((word, i) => (
                <div
                  key={i}
                  className="rounded-md border px-2 py-1.5 text-xs font-mono"
                >
                  <span className="text-muted-foreground">{i + 1}.</span>{" "}
                  {word}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleHide}
            >
              Hide
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="export-password">
                Enter password to reveal
              </Label>
              <Input
                id="export-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your wallet password"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!password || loading}
            >
              {loading ? "Decrypting..." : "Reveal Recovery Phrase"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
