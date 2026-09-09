"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { OrderFilter, OrderRecord } from "@/lib/orders";

export type OrderCounts = Record<OrderFilter, number>;

const EMPTY_COUNTS: OrderCounts = {
  all: 0,
  completed: 0,
  pending: 0,
  cancelled: 0,
};

const LIST_STALE_MS = 30_000;

type OrdersSessionContextValue = {
  filter: OrderFilter;
  setFilter: (filter: OrderFilter) => void;
  page: number;
  setPage: (page: number | ((prev: number) => number)) => void;
  orders: OrderRecord[];
  setOrders: (
    next: OrderRecord[] | ((prev: OrderRecord[]) => OrderRecord[]),
  ) => void;
  total: number;
  setTotal: (total: number) => void;
  pageCount: number;
  setPageCount: (count: number) => void;
  counts: OrderCounts;
  setCounts: (counts: OrderCounts) => void;
  countsLoaded: boolean;
  setCountsLoaded: (loaded: boolean) => void;
  resolvedKey: string | null;
  setResolvedKey: (key: string | null) => void;
  listFetchedAt: number;
  markListFetched: () => void;
  isListStale: () => boolean;
  error: string | null;
  setError: (error: string | null) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
  getCachedOrder: (id: string) => OrderRecord | null;
  cacheOrder: (order: OrderRecord) => void;
  cacheOrders: (orders: OrderRecord[]) => void;
};

const OrdersSessionContext = createContext<OrdersSessionContextValue | null>(
  null,
);

export function OrdersSessionProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [pageCount, setPageCount] = useState(1);
  const [counts, setCounts] = useState<OrderCounts>(EMPTY_COUNTS);
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [resolvedKey, setResolvedKey] = useState<string | null>(null);
  const [listFetchedAt, setListFetchedAt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const orderCacheRef = useRef<Map<string, OrderRecord>>(new Map());

  const getCachedOrder = useCallback((id: string) => {
    return orderCacheRef.current.get(id) ?? null;
  }, []);

  const cacheOrder = useCallback((order: OrderRecord) => {
    orderCacheRef.current.set(order.id, order);
    if (order.internalId) {
      orderCacheRef.current.set(order.internalId, order);
    }
  }, []);

  const cacheOrders = useCallback((rows: OrderRecord[]) => {
    for (const order of rows) {
      orderCacheRef.current.set(order.id, order);
      if (order.internalId) {
        orderCacheRef.current.set(order.internalId, order);
      }
    }
  }, []);

  const markListFetched = useCallback(() => {
    setListFetchedAt(Date.now());
  }, []);

  const isListStale = useCallback(() => {
    if (listFetchedAt === 0) return true;
    return Date.now() - listFetchedAt > LIST_STALE_MS;
  }, [listFetchedAt]);

  const value = useMemo<OrdersSessionContextValue>(
    () => ({
      filter,
      setFilter,
      page,
      setPage,
      orders,
      setOrders,
      total,
      setTotal,
      pageCount,
      setPageCount,
      counts,
      setCounts,
      countsLoaded,
      setCountsLoaded,
      resolvedKey,
      setResolvedKey,
      listFetchedAt,
      markListFetched,
      isListStale,
      error,
      setError,
      scrollY,
      setScrollY,
      getCachedOrder,
      cacheOrder,
      cacheOrders,
    }),
    [
      filter,
      page,
      orders,
      total,
      pageCount,
      counts,
      countsLoaded,
      resolvedKey,
      listFetchedAt,
      markListFetched,
      isListStale,
      error,
      scrollY,
      getCachedOrder,
      cacheOrder,
      cacheOrders,
    ],
  );

  return (
    <OrdersSessionContext.Provider value={value}>
      {children}
    </OrdersSessionContext.Provider>
  );
}

export function useOrdersSession() {
  const ctx = useContext(OrdersSessionContext);
  if (!ctx) {
    throw new Error("useOrdersSession must be used within OrdersSessionProvider");
  }
  return ctx;
}

export { EMPTY_COUNTS };
