"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderDetail } from "@/components/orders/order-detail";
import { OrderDetailGate } from "@/components/orders/order-detail-gate";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { useOrdersSession } from "@/lib/orders-session-store";
import type { OrderRecord } from "@/lib/orders";

type LoadState = {
  id: string;
  order: OrderRecord | null;
  error: string | null;
  missing: boolean;
  fetching: boolean;
};

export function OrderDetailLoader({ id }: { id: string }) {
  const { getCachedOrder, cacheOrder } = useOrdersSession();
  const cached = getCachedOrder(id);

  const [result, setResult] = useState<LoadState>(() => ({
    id,
    order: cached,
    error: null,
    missing: false,
    fetching: !cached,
  }));

  const forId = result.id === id;
  const order = forId
    ? (result.order ?? cached)
    : (cached ?? null);
  const fetching = forId ? result.fetching : !cached;
  const error = forId ? result.error : null;
  const missing = forId ? result.missing : false;
  const showLoading = !order && fetching;

  useEffect(() => {
    let cancelled = false;
    const fromCache = getCachedOrder(id);

    void bffCall<OrderRecord>("getOrder", { params: { id } })
      .then((row) => {
        if (cancelled) return;
        cacheOrder(row);
        setResult({
          id,
          order: row,
          error: null,
          missing: false,
          fetching: false,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err instanceof BffRequestError ? err.status : undefined;
        const fallback = fromCache ?? getCachedOrder(id);
        if (fallback) {
          setResult({
            id,
            order: fallback,
            error: null,
            missing: false,
            fetching: false,
          });
          return;
        }
        setResult({
          id,
          order: null,
          missing: status === 404,
          error:
            status === 404
              ? null
              : err instanceof BffRequestError
                ? err.message
                : "Unable to load this order.",
          fetching: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id, getCachedOrder, cacheOrder]);

  if (showLoading) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading order…
      </div>
    );
  }

  if (missing && !order) notFound();

  if ((error || !order) && !fetching) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <p
          className="rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error ?? "Order not found."}
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading order…
      </div>
    );
  }

  return (
    <OrderDetailGate>
      <OrderDetail order={order} />
    </OrderDetailGate>
  );
}
