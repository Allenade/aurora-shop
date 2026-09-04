import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  formatProductSummary,
  type OrderRecord,
  type OrderStatus,
} from "@/lib/orders";

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
  const secondaryAction =
    order.status === "Delivered"
      ? { label: "Re-order", href: "/shop" }
      : order.status === "Cancelled"
        ? null
        : {
            label: "Track Order",
            href: `/track-orders?q=${encodeURIComponent(order.trackingNumber)}`,
          };

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
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-3.5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>

      <p className="shrink-0 text-lg font-bold whitespace-nowrap text-aurora-ink sm:self-center sm:text-right sm:text-xl">
        {order.total}
      </p>
    </div>
  );
}
