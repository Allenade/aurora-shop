"use client";

import { useEffect, useMemo, useRef } from "react";
import { OrderRow } from "@/components/orders/order-row";
import { OrdersFilterTabs } from "@/components/orders/orders-filter-tabs";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import {
  EMPTY_COUNTS,
  useOrdersSession,
  type OrderCounts,
} from "@/lib/orders-session-store";
import type { OrderFilter, OrderRecord } from "@/lib/orders";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

type OrdersListResponse = {
  items: OrderRecord[];
  total: number;
  page: number;
  limit: number;
  pageCount: number;
};

function statusQueryParam(filter: OrderFilter) {
  if (filter === "completed") return "delivered";
  if (filter === "pending") return "pending,in_transit";
  if (filter === "cancelled") return "cancelled";
  return undefined;
}

function buildPageItems(current: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= totalPages) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const items: Array<number | "ellipsis"> = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const pageNum = sorted[i]!;
    const prev = sorted[i - 1];
    if (prev !== undefined && pageNum - prev > 1) items.push("ellipsis");
    items.push(pageNum);
  }
  return items;
}

export function OrdersList() {
  const {
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
    markListFetched,
    isListStale,
    error,
    setError,
    scrollY,
    setScrollY,
    cacheOrders,
  } = useOrdersSession();

  const fetchKey = `${filter}\0${page}`;
  const hasCache = resolvedKey === fetchKey && orders.length > 0;
  const loading = !hasCache;

  const ordersRef = useRef(orders);
  const scrollRestoredRef = useRef(false);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Restore scroll when returning with cached results
  useEffect(() => {
    if (scrollRestoredRef.current) return;
    if (loading || orders.length === 0) return;
    if (scrollY <= 0) {
      scrollRestoredRef.current = true;
      return;
    }
    scrollRestoredRef.current = true;
    const y = scrollY;
    requestAnimationFrame(() => {
      window.scrollTo({ top: y, behavior: "auto" });
    });
  }, [loading, orders.length, scrollY]);

  // Persist scroll while browsing the list
  useEffect(() => {
    function onScroll() {
      setScrollY(window.scrollY);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setScrollY(window.scrollY);
    };
  }, [setScrollY]);

  useEffect(() => {
    if (countsLoaded) return;
    let cancelled = false;

    void bffCall<OrderCounts>("getOrderCounts")
      .then((res) => {
        if (cancelled) return;
        setCounts({
          all: res.all ?? 0,
          completed: res.completed ?? 0,
          pending: res.pending ?? 0,
          cancelled: res.cancelled ?? 0,
        });
        setCountsLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCounts(EMPTY_COUNTS);
        setCountsLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [countsLoaded, setCounts, setCountsLoaded]);

  useEffect(() => {
    const cacheHit =
      resolvedKey === fetchKey && ordersRef.current.length > 0;
    // Fresh cache — keep UI as-is
    if (cacheHit && !isListStale()) return;

    let cancelled = false;
    const key = fetchKey;
    const soft = cacheHit;

    void bffCall<OrdersListResponse>("listOrders", {
      query: {
        status: statusQueryParam(filter),
        page: String(page),
        limit: String(PAGE_SIZE),
      },
    })
      .then((res) => {
        if (cancelled) return;
        const paginated =
          res && !Array.isArray(res) && Array.isArray(res.items);
        const rows = Array.isArray(res) ? res : paginated ? res.items : [];
        const nextPageCount = paginated
          ? Math.max(1, res.pageCount ?? 1)
          : 1;
        setOrders(rows);
        cacheOrders(rows);
        setTotal(paginated ? (res.total ?? rows.length) : rows.length);
        setPageCount(nextPageCount);
        setResolvedKey(key);
        markListFetched();
        setError(null);
        setPage((current) =>
          current > nextPageCount ? nextPageCount : current,
        );
      })
      .catch((err) => {
        if (cancelled) return;
        // Soft refresh failure — keep cached rows
        if (soft) return;
        setOrders([]);
        setTotal(0);
        setPageCount(1);
        setResolvedKey(key);
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load orders from the API.",
        );
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey, filter, page]);

  function handleFilterChange(next: OrderFilter) {
    setFilter(next);
    setPage(1);
    setScrollY(0);
  }

  function goToPage(nextPage: number) {
    const clamped = Math.min(pageCount, Math.max(1, nextPage));
    if (clamped === page) return;
    setPage(clamped);
    setScrollY(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const currentPage = Math.min(page, pageCount);
  const rangeStart = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(
    (currentPage - 1) * PAGE_SIZE + orders.length,
    total,
  );
  const pagerButtons = useMemo(
    () => buildPageItems(currentPage, pageCount),
    [currentPage, pageCount],
  );

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Orders
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          View and Manage your order history.
        </p>
      </div>

      {error ? (
        <p
          className="mb-4 rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#ececec] px-5 pt-5 pb-4 sm:px-6">
          <OrdersFilterTabs
            value={filter}
            onChange={handleFilterChange}
            counts={counts}
          />
        </div>

        <div className="px-5 sm:px-6">
          {loading && orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8a8a8a]">
              Loading orders…
            </div>
          ) : !loading && orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8a8a8a]">
              No orders in this filter.
            </div>
          ) : orders.length > 0 ? (
            <>
              {loading ? (
                <p className="pt-4 text-sm text-[#8a8a8a]">Updating…</p>
              ) : null}
              <ul className="divide-y divide-[#ececec]">
                {orders.map((order) => (
                  <li key={order.id}>
                    <OrderRow order={order} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        {total > 0 ? (
          <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-[#8a8a8a]">
              Showing {rangeStart}-{rangeEnd} of {total} orders
            </p>
            {pageCount > 1 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1 || loading}
                  onClick={() => goToPage(currentPage - 1)}
                  className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {pagerButtons.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-1 text-[#9a9a9a]"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      disabled={loading}
                      onClick={() => goToPage(item)}
                      aria-current={item === currentPage ? "page" : undefined}
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold",
                        item === currentPage
                          ? "bg-aurora-lime text-aurora-ink"
                          : "border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]",
                      )}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  disabled={currentPage >= pageCount || loading}
                  onClick={() => goToPage(currentPage + 1)}
                  className="h-9 rounded-lg border border-[#e0e0e0] bg-white px-3 text-sm font-semibold text-aurora-ink hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
