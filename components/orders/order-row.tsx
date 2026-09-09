"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { bffCall } from "@/lib/bff/generated/client";
import { useCart } from "@/lib/cart-store";
import {
  formatProductSummary,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders";
import {
  formatMergeNotices,
  reorderLinesFromOrder,
  saveReorderNotices,
} from "@/lib/reorder";

function statusTone(status: OrderStatus) {
  if (status === "Delivered") return "green" as const;
  if (status === "Pending") return "orange" as const;
  if (status === "In Transit") return "blue" as const;
  return "red" as const;
}

function MetaIcon({ type }: { type: "date" | "items" | "ref" }) {
  if (type === "date") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect
          x="4"
          y="5"
          width="16"
          height="15"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M8 3.5v3M16 3.5v3M4 10h16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (type === "items") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7.5 8.5V7a4.5 4.5 0 0 1 9 0v1.5M6 8.5h12l.7 11a1.5 1.5 0 0 1-1.5 1.6H6.8a1.5 1.5 0 0 1-1.5-1.6l.7-11Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4.5h7l3.5 3.5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrderRow({ order }: { order: OrderRecord }) {
  const router = useRouter();
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [notices, setNotices] = useState<string[]>([]);

  async function handleReorder() {
    if (busy) return;
    try {
      setBusy(true);
      setNotices([]);
      let source = order;
      let lines = reorderLinesFromOrder(source);
      if (lines.length === 0) {
        source = await bffCall<OrderRecord>("getOrder", {
          params: { id: order.id },
        });
        lines = reorderLinesFromOrder(source);
      }
      if (lines.length === 0) {
        setNotices(["This order has no products that can be re-ordered."]);
        return;
      }

      const result = await cart.mergeItems(lines);
      const nextNotices = formatMergeNotices(result);
      if (!result.addedAny) {
        setNotices(
          nextNotices.length > 0
            ? nextNotices
            : ["None of the items from this order could be added to your cart."],
        );
        return;
      }
      saveReorderNotices(nextNotices);
      router.push("/cart");
    } catch (err) {
      setNotices([
        err instanceof Error ? err.message : "Unable to add items to cart.",
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="text-base font-bold text-aurora-ink">{order.id}</h3>
          <Badge tone={statusTone(order.status)}>{order.status}</Badge>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#8a8a8a]">
          <span className="inline-flex items-center gap-1.5">
            <MetaIcon type="date" />
            {order.date}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MetaIcon type="items" />
            {order.itemCount} Items
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MetaIcon type="ref" />
            {order.reference}
          </span>
        </div>

        <p className="mt-2.5 text-sm leading-relaxed text-[#6b7280]">
          <span className="font-medium text-[#8a8a8a]">Products: </span>
          {formatProductSummary(order.products)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-3.5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            View Details
          </Link>
          {order.status === "Delivered" ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleReorder()}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-3.5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7] disabled:opacity-60"
            >
              {busy ? "Adding…" : "Re-order"}
            </button>
          ) : order.status !== "Cancelled" ? (
            <Link
              href={`/track-orders?q=${encodeURIComponent(order.trackingNumber)}`}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-3.5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
            >
              Track Order
            </Link>
          ) : null}
        </div>

        {notices.length > 0 ? (
          <ul
            className="mt-3 space-y-1 rounded-lg border border-[#f0d9a8] bg-[#fff8eb] px-3 py-2 text-xs text-[#8a5a00]"
            role="status"
          >
            {notices.map((notice) => (
              <li key={notice}>{notice}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <p className="shrink-0 text-lg font-bold whitespace-nowrap text-aurora-ink sm:self-center sm:text-right sm:text-xl">
        {order.total}
      </p>
    </div>
  );
}
