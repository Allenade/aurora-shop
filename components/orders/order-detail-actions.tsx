"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/lib/cart-store";
import type { OrderRecord } from "@/lib/orders";
import {
  formatMergeNotices,
  reorderLinesFromOrder,
  saveReorderNotices,
} from "@/lib/reorder";

type OrderDetailActionsProps = {
  order: OrderRecord;
};

export function OrderDetailActions({ order }: OrderDetailActionsProps) {
  const router = useRouter();
  const cart = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notices, setNotices] = useState<string[]>([]);

  const canTrack =
    order.status !== "Delivered" &&
    order.status !== "Cancelled" &&
    Boolean(order.trackingNumber?.trim());

  async function handleReorder() {
    const lines = reorderLinesFromOrder(order);
    if (lines.length === 0) {
      setError("This order has no products that can be re-ordered.");
      setNotices([]);
      return;
    }
    try {
      setBusy(true);
      setError(null);
      setNotices([]);
      // Stock checks run quickly; cart writes continue in the background.
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
      setError(
        err instanceof Error ? err.message : "Unable to add items to cart.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {canTrack ? (
        <Link
          href={`/track-orders?q=${encodeURIComponent(order.trackingNumber)}`}
          className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          Track Order
        </Link>
      ) : null}
      <button
        type="button"
        disabled={busy}
        onClick={() => void handleReorder()}
        className={`inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:opacity-60 ${
          canTrack
            ? "border border-aurora-ink/20 bg-white hover:bg-[#f7f7f7]"
            : "bg-aurora-lime"
        }`}
      >
        {busy ? "Adding to cart…" : "Re-order All Items"}
      </button>
      <Link
        href="/settings"
        className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-lg border border-aurora-ink/20 bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
      >
        Contact Support
      </Link>
      {error ? (
        <p className="text-xs text-[#d64545]" role="alert">
          {error}
        </p>
      ) : null}
      {notices.length > 0 ? (
        <ul
          className="space-y-1 rounded-lg border border-[#f0d9a8] bg-[#fff8eb] px-3 py-2 text-xs text-[#8a5a00]"
          role="status"
        >
          {notices.map((notice) => (
            <li key={notice}>{notice}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
