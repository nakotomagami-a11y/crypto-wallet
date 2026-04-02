"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MnemonicDisplayProps {
  mnemonic: string;
  onConfirm: () => void;
}

export function MnemonicDisplay({ mnemonic, onConfirm }: MnemonicDisplayProps) {
  const [revealed, setRevealed] = useState(false);
  const words = mnemonic.split(" ");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Your Recovery Phrase</h3>
        <p className="text-sm text-muted-foreground">
          Write these 12 words down and store them safely. This is the only way
          to recover your wallet.
        </p>
      </div>

      <div className="glass-card rounded-2xl p-6">
          {revealed ? (
            <div className="grid grid-cols-3 gap-3">
              {words.map((word, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">{i + 1}.</span>
                  <span className="font-mono">{word}</span>
                </div>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setRevealed(true)}
              className="flex h-40 w-full items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-accent/50 transition-colors"
            >
              Click to reveal recovery phrase
            </button>
          )}
      </div>

      {revealed && (
        <Button onClick={onConfirm} className="w-full">
          I&apos;ve written it down
        </Button>
      )}
    </div>
  );
}
