"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MnemonicInputProps {
  onSubmit: (mnemonic: string) => void;
  error?: string | null;
}

type WordCount = 12 | 24;

export function MnemonicInput({ onSubmit, error }: MnemonicInputProps) {
  const [wordCount, setWordCount] = useState<WordCount>(12);
  const [words, setWords] = useState<string[]>(Array(12).fill(""));

  function handleWordCountChange(count: WordCount) {
    setWordCount(count);
    if (count > words.length) {
      setWords([...words, ...Array(count - words.length).fill("")]);
    } else {
      setWords(words.slice(0, count));
    }
  }

  function handleChange(index: number, value: string) {
    const trimmed = value.trim();
    if (trimmed.includes(" ")) {
      const parts = trimmed.split(/\s+/);
      // Auto-detect 24-word mnemonic on paste
      if (parts.length > 12 && wordCount === 12) {
        handleWordCountChange(24);
      }
      const targetCount = parts.length > 12 ? 24 : wordCount;
      const updated = Array(targetCount).fill("");
      parts.forEach((word, i) => {
        if (i < targetCount) updated[i] = word.toLowerCase();
      });
      setWords(updated);
      if (parts.length > 12) setWordCount(24);
      return;
    }
    const updated = [...words];
    updated[index] = value.toLowerCase();
    setWords(updated);
  }

  function handleSubmit() {
    onSubmit(words.filter((w) => w).join(" "));
  }

  const allFilled = words.every((w) => w.length > 0);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Enter Recovery Phrase</h3>
        <p className="text-sm text-muted-foreground">
          Enter your 12 or 24-word recovery phrase to import your wallet.
        </p>
      </div>

      <div className="flex gap-1 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5 w-fit">
        {([12, 24] as WordCount[]).map((count) => (
          <button
            key={count}
            onClick={() => handleWordCountChange(count)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-all duration-200 ${
              wordCount === count
                ? "bg-[rgba(255,255,255,0.1)] text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {count} words
          </button>
        ))}
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
