"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderRow } from "@/components/orders/order-row";
import { OrdersFilterTabs } from "@/components/orders/orders-filter-tabs";
import { bffCall } from "@/lib/bff/generated/client";
import {
  ORDERS,
  filterOrders,
  getOrderCounts,
  type OrderFilter,
  type OrderRecord,
} from "@/lib/orders";

export function OrdersList() {
  const [filter, setFilter] = useState<OrderFilter>("all");
  const [records, setRecords] = useState<OrderRecord[]>(ORDERS);

  useEffect(() => {
    void bffCall<OrderRecord[]>("listOrders")
      .then((rows) => {
        if (Array.isArray(rows)) setRecords(rows);
      })
      .catch(() => undefined);
  }, []);

  const counts = useMemo(() => getOrderCounts(records), [records]);
  const orders = useMemo(
    () => filterOrders(records, filter),
    [records, filter],
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

      <div className="rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="border-b border-[#ececec] px-5 pt-5 pb-4 sm:px-6">
          <OrdersFilterTabs
            value={filter}
            onChange={setFilter}
            counts={counts}
          />
        </div>

        <div className="px-5 sm:px-6">
          {orders.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8a8a8a]">
              No orders in this filter.
            </div>
          ) : (
            <ul className="divide-y divide-[#ececec]">
              {orders.map((order) => (
                <li key={order.id}>
                  <OrderRow order={order} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
