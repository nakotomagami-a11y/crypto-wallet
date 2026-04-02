"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useTokenSearch } from "@/modules/market/hooks/use-token-search";

export function TokenSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [open, setOpen] = useState(false);
  const { data: results, isLoading } = useTokenSearch(debouncedQuery);
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/market/${id}`);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => query.length >= 2 && setOpen(true)}
        placeholder="Search tokens..."
        className="glass-input h-11 text-sm"
      />

      {open && debouncedQuery.length >= 2 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-xl overflow-hidden border border-[var(--outline-dim)] bg-[var(--popover)] shadow-[0_8px_40px_rgba(0,0,0,0.45)]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          ) : !results?.length ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No tokens found
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto glass-scrollbar">
              {results.map((token) => (
                <button
                  key={token.id}
                  onClick={() => handleSelect(token.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <img
                    src={token.thumb}
                    alt={token.name}
                    className="h-7 w-7 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{token.name}</p>
                    <p className="text-xs text-muted-foreground">{token.symbol}</p>
                  </div>
                  {token.market_cap_rank && (
                    <span className="text-xs text-muted-foreground">
                      #{token.market_cap_rank}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
