"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  BuyerDashboardResponse,
  DashboardStat,
  RecentOrder,
} from "@/lib/dashboard";

const STALE_MS = 30_000;

type DashboardSessionContextValue = {
  stats: DashboardStat[];
  recentOrders: RecentOrder[];
  ready: boolean;
  error: string | null;
  fetchedAt: number;
  isStale: () => boolean;
  apply: (data: BuyerDashboardResponse) => void;
  fail: (message: string) => void;
  setError: (error: string | null) => void;
};

const DashboardSessionContext =
  createContext<DashboardSessionContextValue | null>(null);

export function DashboardSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState(0);

  const apply = useCallback((data: BuyerDashboardResponse) => {
    setStats(Array.isArray(data.stats) ? data.stats : []);
    setRecentOrders(
      Array.isArray(data.recentOrders) ? data.recentOrders : [],
    );
    setError(null);
    setReady(true);
    setFetchedAt(Date.now());
  }, []);

  const fail = useCallback((message: string) => {
    setError(message);
    setReady(true);
    setFetchedAt(Date.now());
  }, []);

  const isStale = useCallback(() => {
    if (!ready) return true;
    if (fetchedAt === 0) return true;
    return Date.now() - fetchedAt > STALE_MS;
  }, [ready, fetchedAt]);

  const value = useMemo<DashboardSessionContextValue>(
    () => ({
      stats,
      recentOrders,
      ready,
      error,
      fetchedAt,
      isStale,
      apply,
      fail,
      setError,
    }),
    [stats, recentOrders, ready, error, fetchedAt, isStale, apply, fail],
  );

  return (
    <DashboardSessionContext.Provider value={value}>
      {children}
    </DashboardSessionContext.Provider>
  );
}

export function useDashboardSession() {
  const ctx = useContext(DashboardSessionContext);
  if (!ctx) {
    throw new Error(
      "useDashboardSession must be used within DashboardSessionProvider",
    );
  }
  return ctx;
}
