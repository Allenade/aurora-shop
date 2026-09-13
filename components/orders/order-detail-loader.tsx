"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { OrderDetail } from "@/components/orders/order-detail";
import { OrderDetailGate } from "@/components/orders/order-detail-gate";
import { EmptyState } from "@/components/ui/empty-state";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { useOrdersSession } from "@/lib/orders-session-store";
import type { OrderRecord } from "@/lib/orders";
import { DetailPageSkeleton } from "@/components/ui/skeleton";

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
        const message =
          status === 404
            ? null
            : err instanceof BffRequestError
              ? err.message
              : "Unable to load this order.";
        if (message) toast.error(message);
        setResult({
          id,
          order: null,
          missing: status === 404,
          error: message,
          fetching: false,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [id, getCachedOrder, cacheOrder]);

  if (showLoading) {
    return <DetailPageSkeleton />;
  }

  if (missing && !order) notFound();

  if ((error || !order) && !fetching) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <EmptyState description={error ?? "Order not found."} />
      </div>
    );
  }

  if (!order) {
    return <DetailPageSkeleton />;
  }

  return (
    <OrderDetailGate>
      <OrderDetail order={order} />
    </OrderDetailGate>
  );
}
