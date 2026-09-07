"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { OrderDetail } from "@/components/orders/order-detail";
import { OrderDetailGate } from "@/components/orders/order-detail-gate";
import { bffCall } from "@/lib/bff/generated/client";
import { getOrderById, type OrderRecord } from "@/lib/orders";

export function OrderDetailLoader({ id }: { id: string }) {
  const fallback = getOrderById(id);
  const [order, setOrder] = useState<OrderRecord | null>(fallback);
  const [ready, setReady] = useState(!fallback);

  useEffect(() => {
    void bffCall<OrderRecord>("getOrder", { params: { id } })
      .then(setOrder)
      .catch(() => {
        if (!fallback) setOrder(null);
      })
      .finally(() => setReady(true));
  }, [id, fallback]);

  if (!ready && !order) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
        Loading order…
      </div>
    );
  }

  if (!order) notFound();

  return (
    <OrderDetailGate>
      <OrderDetail order={order} />
    </OrderDetailGate>
  );
}
