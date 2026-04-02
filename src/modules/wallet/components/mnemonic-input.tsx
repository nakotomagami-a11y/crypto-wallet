"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MnemonicInputProps {
  onSubmit: (mnemonic: string) => void;
  error?: string | null;
}

export function MnemonicInput({ onSubmit, error }: MnemonicInputProps) {
  const [words, setWords] = useState<string[]>(Array(12).fill(""));

  function handleChange(index: number, value: string) {
    // Handle paste of full mnemonic
    const trimmed = value.trim();
    if (trimmed.includes(" ")) {
      const parts = trimmed.split(/\s+/).slice(0, 12);
      const updated = [...words];
      parts.forEach((word, i) => {
        if (index + i < 12) updated[index + i] = word.toLowerCase();
      });
      setWords(updated);
      return;
    }
    const updated = [...words];
    updated[index] = value.toLowerCase();
    setWords(updated);
  }

  function handleSubmit() {
    onSubmit(words.join(" "));
  }

  const allFilled = words.every((w) => w.length > 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Enter Recovery Phrase</h3>
        <p className="text-sm text-muted-foreground">
          Enter your 12-word recovery phrase to import your wallet.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {words.map((word, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 text-right text-xs text-muted-foreground">
              {i + 1}.
            </span>
            <Input
              value={word}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="word"
              className="font-mono text-sm"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button onClick={handleSubmit} disabled={!allFilled} className="w-full">
        Import Wallet
      </Button>
    </div>
  );
}
