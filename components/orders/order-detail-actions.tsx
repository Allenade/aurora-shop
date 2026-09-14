"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { TrackOrderButton } from "@/components/orders/track-order-button";
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

  const canTrack =
    order.status !== "Delivered" &&
    order.status !== "Cancelled" &&
    Boolean(order.trackingNumber?.trim());

  async function handleReorder() {
    const lines = reorderLinesFromOrder(order);
    if (lines.length === 0) {
      toast.error("This order has no products that can be re-ordered.");
      return;
    }
    try {
      setBusy(true);
      // Stock checks run quickly; cart writes continue in the background.
      const result = await cart.mergeItems(lines);
      const nextNotices = formatMergeNotices(result);
      if (!result.addedAny) {
        toast.error(
          nextNotices[0] ??
            "None of the items from this order could be added to your cart.",
        );
        for (const notice of nextNotices.slice(1)) {
          toast.message(notice);
        }
        return;
      }
      saveReorderNotices(nextNotices);
      for (const notice of nextNotices) {
        toast.message(notice);
      }
      if (nextNotices.length === 0) {
        toast.success("Items added to cart.");
      }
      router.push("/cart");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to add items to cart.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2.5">
      {canTrack ? (
        <TrackOrderButton
          trackingNumber={order.trackingNumber}
          className="h-11 w-full bg-aurora-lime px-4 transition-opacity hover:opacity-90"
        />
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
    </div>
  );
}
