"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RecentQuote } from "@/lib/procurements";

const STALE_MS = 30_000;

type ProcurementSessionContextValue = {
  quotes: RecentQuote[];
  setQuotes: (
    next: RecentQuote[] | ((prev: RecentQuote[]) => RecentQuote[]),
  ) => void;
  loaded: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  fetchedAt: number;
  isStale: () => boolean;
  apply: (rows: RecentQuote[]) => void;
  fail: (message: string) => void;
};

const ProcurementSessionContext =
  createContext<ProcurementSessionContextValue | null>(null);

export function ProcurementSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [quotes, setQuotes] = useState<RecentQuote[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(0);

  const apply = useCallback((rows: RecentQuote[]) => {
    setQuotes(rows);
    setLoaded(true);
    setError(null);
    setFetchedAt(Date.now());
  }, []);

  const fail = useCallback((message: string) => {
    setError(message);
    setLoaded(true);
    setFetchedAt(Date.now());
  }, []);

  const isStale = useCallback(() => {
    if (!loaded) return true;
    if (fetchedAt === 0) return true;
    return Date.now() - fetchedAt > STALE_MS;
  }, [loaded, fetchedAt]);

  const value = useMemo<ProcurementSessionContextValue>(
    () => ({
      quotes,
      setQuotes,
      loaded,
      error,
      setError,
      fetchedAt,
      isStale,
      apply,
      fail,
    }),
    [quotes, loaded, error, fetchedAt, isStale, apply, fail],
  );

  return (
    <ProcurementSessionContext.Provider value={value}>
      {children}
    </ProcurementSessionContext.Provider>
  );
}

export function useProcurementSession() {
  const ctx = useContext(ProcurementSessionContext);
  if (!ctx) {
    throw new Error(
      "useProcurementSession must be used within ProcurementSessionProvider",
    );
  }
  return ctx;
}
