"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Currency = "usd" | "eur";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: "$",
  eur: "€",
};

interface CurrencyContextValue {
  currency: Currency;
  symbol: string;
  setCurrency: (c: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: "usd",
  symbol: "$",
  setCurrency: () => {},
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("usd");

  useEffect(() => {
    const saved = localStorage.getItem("vault-currency") as Currency | null;
    if (saved === "usd" || saved === "eur") {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("vault-currency", c);
  }, []);

  return (
    <CurrencyContext.Provider value={{ currency, symbol: CURRENCY_SYMBOLS[currency], setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
