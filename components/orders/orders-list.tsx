"use client";

import { useMemo, useState } from "react";
import { OrderRow } from "@/components/orders/order-row";
import { OrdersFilterTabs } from "@/components/orders/orders-filter-tabs";
import {
  ORDERS,
  filterOrders,
  getOrderCounts,
  type OrderFilter,
} from "@/lib/orders";

export function OrdersList() {
  const [filter, setFilter] = useState<OrderFilter>("all");
  const counts = useMemo(() => getOrderCounts(ORDERS), []);
  const orders = useMemo(() => filterOrders(ORDERS, filter), [filter]);

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

      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-5 sm:px-6">
        <OrdersFilterTabs
          value={filter}
          onChange={setFilter}
          counts={counts}
        />

        <div className="mt-2">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8a8a8a]">
              No orders in this filter.
            </div>
          ) : (
            orders.map((order) => <OrderRow key={order.id} order={order} />)
          )}
        </div>
      </div>
    </div>
  );
}
