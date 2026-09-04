"use client";

import { useMemo, useState } from "react";
import { AdminOrderDetailDrawer } from "@/components/admin/admin-order-detail-drawer";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_ORDERS,
  ADMIN_ORDERS_TOTAL_COUNT,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

const FILTERS = ["All Orders", "Delivered", "In Transit", "Pending"] as const;

function statusTone(status: AdminOrderStatus) {
  if (status === "In Transit") return "blue" as const;
  if (status === "Delivered") return "green" as const;
  return "orange" as const;
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 3.5h7.2L19 7.3V20a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V5A1.5 1.5 0 0 1 8 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M15 3.5V7h3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12h5M9.5 15.5h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M17.5 17.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M19.2 18.2 20.5 19.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function OrderRow({
  order,
  onOpen,
}: {
  order: AdminOrder;
  onOpen: (order: AdminOrder) => void;
}) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <button
          type="button"
          onClick={() => onOpen(order)}
          className="text-sm font-medium whitespace-nowrap text-[#2f6fed] hover:underline"
        >
          {order.id}
        </button>
      </td>
      <td className="px-3 py-4">
        <p className="text-sm font-semibold whitespace-nowrap text-aurora-ink">
          {order.customer}
        </p>
        <p className="mt-0.5 text-xs whitespace-nowrap text-[#9a9a9a]">
          {order.email}
        </p>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {order.items} Items
      </td>
      <td className="px-3 py-4 text-sm font-medium whitespace-nowrap text-aurora-ink">
        {order.amount}
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {order.payment}
      </td>
      <td className="px-3 py-4">
        <Badge tone={statusTone(order.status)}>{order.status}</Badge>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {order.date}
      </td>
      <td className="py-4 pl-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(order)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`View ${order.id}`}
          >
            <EyeIcon />
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`Invoice ${order.id}`}
          >
            <InvoiceIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminOrders() {
  const [orders, setOrders] = useState(ADMIN_ORDERS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Orders");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesQuery =
        !q ||
        order.id.toLowerCase().includes(q) ||
        order.customer.toLowerCase().includes(q) ||
        order.email.toLowerCase().includes(q);

      const matchesFilter =
        filter === "All Orders" || order.status === filter;

      return matchesQuery && matchesFilter;
    });
  }, [orders, query, filter]);

  const selectedOrder =
    selectedId === null
      ? null
      : (orders.find((order) => order.id === selectedId) ?? null);

  function handleStatusChange(status: AdminOrderStatus) {
    if (!selectedId) return;
    setOrders((prev) =>
      prev.map((order) =>
        order.id === selectedId ? { ...order, status } : order,
      ),
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Orders Management
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          {ADMIN_ORDERS_TOTAL_COUNT} Orders
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9a9a9a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M16.5 16.5 20 20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by Order ID or Customer"
            className="h-11 w-full rounded-xl border border-[#e5e5e5] bg-white pr-4 pl-10 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
          />
        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as (typeof FILTERS)[number])
          }
          className="h-11 rounded-xl border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-aurora-ink outline-none focus:border-aurora-ink/30"
        >
          {FILTERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="overflow-x-auto px-5 sm:px-6">
          <table className="w-full min-w-[980px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ececec]">
                {[
                  "Order ID",
                  "Customer",
                  "Items",
                  "Amount",
                  "Payment",
                  "Status",
                  "Date",
                  "Actions",
                ].map((label) => (
                  <th
                    key={label}
                    className="py-3.5 text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase first:pr-4 last:pl-3 not-first:px-3"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-16 text-center text-sm text-[#8a8a8a]"
                  >
                    No orders match this search.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    onOpen={(next) => setSelectedId(next.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#8a8a8a]">
            Showing 1-{filtered.length} of {ADMIN_ORDERS_TOTAL_COUNT} orders
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold",
                  page === 1
                    ? "bg-aurora-lime text-aurora-ink"
                    : "border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]",
                )}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-[#9a9a9a]">…</span>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e0e0e0] text-sm font-semibold text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              11
            </button>
            <button
              type="button"
              className="h-9 rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedOrder ? (
        <AdminOrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      ) : null}
    </div>
  );
}
