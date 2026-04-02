"use client";

import { useState, useRef, useEffect } from "react";
import { useWalletStore } from "@/modules/wallet/hooks/use-wallet-store";
import { deriveAllAccounts } from "@/modules/wallet/utils/derive";

const MAX_ACCOUNTS = 5;

export function AccountSelector() {
  const { accountIndex, mnemonic, isDemo, setAccount } = useWalletStore();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Demo mode doesn't support multi-account (no mnemonic)
  if (isDemo || !mnemonic) return null;

  function handleSwitch(index: number) {
    if (!mnemonic || index === accountIndex) {
      setOpen(false);
      return;
    }
    const { eth, sol } = deriveAllAccounts(mnemonic, index);
    setAccount(index, eth.address, sol.address);
    setOpen(false);
  }

  // Pre-derive addresses for the dropdown
  const accounts = Array.from({ length: MAX_ACCOUNTS }, (_, i) => {
    const { eth } = deriveAllAccounts(mnemonic, i);
    return { index: i, ethAddress: eth.address };
  });

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-[rgba(255,255,255,0.06)]"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-eth-blue text-[10px] text-white font-bold">
          {accountIndex + 1}
        </div>
        <span className="text-muted-foreground">Account {accountIndex + 1}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-xl overflow-hidden border border-[var(--outline-dim)] bg-[var(--popover)] shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <div className="p-2 text-[10px] text-muted-foreground uppercase tracking-wider px-3">
            Switch Account
          </div>
          {accounts.map((acc) => (
            <button
              key={acc.index}
              onClick={() => handleSwitch(acc.index)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                acc.index === accountIndex
                  ? "bg-[rgba(255,255,255,0.08)]"
                  : "hover:bg-[rgba(255,255,255,0.04)]"
              }`}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-eth-blue text-[10px] text-white font-bold">
                {acc.index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium">Account {acc.index + 1}</p>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  {acc.ethAddress}
                </p>
              </div>
              {acc.index === accountIndex && (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-chart-green shrink-0"><path d="M20 6 9 17l-5-5"/></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
