"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vault-watchlist";

export interface WatchlistItem {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

function load(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as WatchlistItem[];
}

function save(items: WatchlistItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setItems(load());
  }, []);

  const addToWatchlist = useCallback((item: WatchlistItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) return prev;
      const next = [...prev, item];
      save(next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      save(next);
      return next;
    });
  }, []);

  const isWatched = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  return { items, addToWatchlist, removeFromWatchlist, isWatched };
}
