"use client";

import { useState } from "react";
import { AdminGreeting } from "@/components/admin/admin-greeting";
import { AdminOrderBreakdown } from "@/components/admin/admin-order-breakdown";
import { AdminOrderDetailDrawer } from "@/components/admin/admin-order-detail-drawer";
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminStockAlerts } from "@/components/admin/admin-stock-alerts";
import {
  ADMIN_ORDERS,
  ADMIN_RECENT_ORDERS,
  ADMIN_STATS,
  ORDER_BREAKDOWN,
  STOCK_ALERTS,
  type AdminOrder,
  type AdminOrderStatus,
  type AdminRecentOrder,
} from "@/lib/admin";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function toAdminOrder(recent: AdminRecentOrder): AdminOrder {
  const existing = ADMIN_ORDERS.find((order) => order.id === recent.id);
  if (existing) {
    return {
      ...existing,
      customer: recent.customer,
      amount: recent.amount,
      total: recent.amount.includes(".")
        ? recent.amount
        : `${recent.amount}.00`,
      status: recent.status,
      date: recent.date,
    };
  }

  const initials = initialsFromName(recent.customer);
  return {
    id: recent.id,
    customer: recent.customer,
    email: `${initials.toLowerCase()}@email.com`,
    initials,
    items: 1,
    amount: recent.amount,
    total: recent.amount.includes(".")
      ? recent.amount
      : `${recent.amount}.00`,
    payment: "Bank Transfer",
    status: recent.status,
    date: recent.date,
  };
}

export function AdminOverview() {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  function handleStatusChange(status: AdminOrderStatus) {
    setSelectedOrder((prev) => (prev ? { ...prev, status } : prev));
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <AdminGreeting />
      <AdminStats stats={ADMIN_STATS} />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.85fr)]">
        <AdminRecentOrders
          orders={ADMIN_RECENT_ORDERS}
          onOpenOrder={(recent) => setSelectedOrder(toAdminOrder(recent))}
        />
        <div className="flex flex-col gap-5">
          <AdminStockAlerts alerts={STOCK_ALERTS} />
          <AdminOrderBreakdown items={ORDER_BREAKDOWN} />
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
