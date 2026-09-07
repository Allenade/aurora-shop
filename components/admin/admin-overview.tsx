"use client";

import { useEffect, useState } from "react";
import { AdminGreeting } from "@/components/admin/admin-greeting";
import { AdminOrderBreakdown } from "@/components/admin/admin-order-breakdown";
import { AdminOrderDetailDrawer } from "@/components/admin/admin-order-detail-drawer";
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminStockAlerts } from "@/components/admin/admin-stock-alerts";
import {
  ADMIN_STATS,
  ORDER_BREAKDOWN,
  STOCK_ALERTS,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminRecentOrder,
  type AdminStat,
  type OrderBreakdownItem,
  type StockAlert,
} from "@/lib/admin";
import { bffCall } from "@/lib/bff/generated/client";
import { fulfillmentStatus, toAdminOrder } from "@/lib/bff/map";
import type { OrderRecord } from "@/lib/orders";

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStat[]>(ADMIN_STATS);
  const [recentOrders, setRecentOrders] =
    useState<AdminRecentOrder[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>(STOCK_ALERTS);
  const [breakdown, setBreakdown] =
    useState<OrderBreakdownItem[]>(ORDER_BREAKDOWN);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    void bffCall<{
      stats?: AdminStat[];
      recentOrders?: AdminRecentOrder[];
      stockAlerts?: StockAlert[];
      orderBreakdown?: OrderBreakdownItem[];
    }>("getAdminOverview")
      .then((data) => {
        if (data.stats?.length) setStats(data.stats as AdminStat[]);
        if (data.recentOrders) setRecentOrders(data.recentOrders);
        if (data.stockAlerts) setAlerts(data.stockAlerts);
        if (data.orderBreakdown) {
          setBreakdown(data.orderBreakdown as OrderBreakdownItem[]);
        }
      })
      .catch(() => undefined);
  }, []);

  function handleStatusChange(status: AdminOrderStatus) {
    if (!selectedOrder?.internalId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
      return;
    }
    void bffCall("setOrderStatus", {
      params: { id: selectedOrder.internalId },
      body: { status: fulfillmentStatus(status) },
    })
      .then(() => {
        setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
        setRecentOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id ? { ...order, status } : order,
          ),
        );
      })
      .catch(() => undefined);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AdminGreeting />
      <AdminStats stats={stats} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.85fr)]">
        <AdminRecentOrders
          orders={recentOrders}
          onOpenOrder={(recent) => {
            void bffCall<OrderRecord>("getOrder", { params: { id: recent.id } })
              .then((order) => setSelectedOrder(toAdminOrder(order)))
              .catch(() =>
                setSelectedOrder({
                  id: recent.id,
                  customer: recent.customer,
                  email: "",
                  initials: recent.customer
                    .split(" ")
                    .map((part) => part[0] ?? "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase(),
                  items: 1,
                  amount: recent.amount,
                  total: recent.amount,
                  payment: "Bank Transfer",
                  status: recent.status,
                  date: recent.date,
                }),
              );
          }}
        />
        <div className="flex flex-col gap-5">
          <AdminStockAlerts alerts={alerts} />
          <AdminOrderBreakdown items={breakdown} />
        </div>
      </div>

      {selectedOrder ? (
        <AdminOrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      ) : null}
    </div>
  );
}
