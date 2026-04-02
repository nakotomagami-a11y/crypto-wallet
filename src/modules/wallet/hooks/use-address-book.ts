"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vault-address-book";

export interface SavedAddress {
  label: string;
  address: string;
  network: "ethereum" | "solana";
}

function load(): SavedAddress[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as SavedAddress[];
}

function save(addresses: SavedAddress[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
}

export function useAddressBook() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  useEffect(() => {
    setAddresses(load());
  }, []);

  const addAddress = useCallback((entry: SavedAddress) => {
    setAddresses((prev) => {
      const exists = prev.some(
        (a) => a.address.toLowerCase() === entry.address.toLowerCase() && a.network === entry.network
      );
      if (exists) return prev;
      const next = [...prev, entry];
      save(next);
      return next;
    });
  }, []);

  const removeAddress = useCallback((address: string, network: string) => {
    setAddresses((prev) => {
      const next = prev.filter(
        (a) => !(a.address.toLowerCase() === address.toLowerCase() && a.network === network)
      );
      save(next);
      return next;
    });
  }, []);

  const getByNetwork = useCallback(
    (network: "ethereum" | "solana") => addresses.filter((a) => a.network === network),
    [addresses]
  );

  return { addresses, addAddress, removeAddress, getByNetwork };
}
