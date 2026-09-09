"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminGreeting } from "@/components/admin/admin-greeting";
import { AdminOrderBreakdown } from "@/components/admin/admin-order-breakdown";
import { AdminOrderDetailDrawer } from "@/components/admin/admin-order-detail-drawer";
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminStockAlerts } from "@/components/admin/admin-stock-alerts";
import {
  type AdminGreetingData,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminRecentOrder,
  type AdminStat,
  type OrderBreakdownItem,
  type StockAlert,
} from "@/lib/admin";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { fulfillmentStatus, toAdminOrder } from "@/lib/bff/map";
import type { OrderRecord } from "@/lib/orders";
import type { SessionUser } from "@/lib/permissions/permissions.types";

type OverviewResponse = {
  stats?: AdminStat[];
  recentOrders?: AdminRecentOrder[];
  stockAlerts?: StockAlert[];
  orderBreakdown?: OrderBreakdownItem[];
};

function buildGreeting(user?: SessionUser | null): AdminGreetingData {
  const hour = new Date().getHours();
  const part =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const name = user?.firstName?.trim() || "Admin";
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return { title: `${part}, ${name}`, date };
}

export function AdminOverview() {
  const [stats, setStats] = useState<AdminStat[]>([]);
  const [recentOrders, setRecentOrders] = useState<AdminRecentOrder[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [breakdown, setBreakdown] = useState<OrderBreakdownItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [greeting, setGreeting] = useState<AdminGreetingData>(() =>
    buildGreeting(null),
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loading = !ready;

  useEffect(() => {
    let cancelled = false;

    void Promise.all([
      bffCall<SessionUser>("getAuthMe").catch(() => null),
      bffCall<OverviewResponse>("getAdminOverview"),
    ])
      .then(([me, data]) => {
        if (cancelled) return;
        setGreeting(buildGreeting(me));
        setStats(Array.isArray(data.stats) ? data.stats : []);
        setRecentOrders(Array.isArray(data.recentOrders) ? data.recentOrders : []);
        setAlerts(Array.isArray(data.stockAlerts) ? data.stockAlerts : []);
        setBreakdown(
          Array.isArray(data.orderBreakdown) ? data.orderBreakdown : [],
        );
        setError(null);
        setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load admin overview from the API.",
        );
        setStats([]);
        setRecentOrders([]);
        setAlerts([]);
        setBreakdown([]);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const emptyHint = useMemo(() => {
    if (loading) return "Loading overview…";
    return null;
  }, [loading]);

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
      <AdminGreeting greeting={greeting} />

      {error ? (
        <p
          className="rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {emptyHint ? (
        <p className="text-sm text-[#8a8a8a]">{emptyHint}</p>
      ) : null}

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
                  internalId: recent.internalId,
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
