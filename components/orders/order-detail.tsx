import Link from "next/link";
import { OrderDetailActions } from "@/components/orders/order-detail-actions";
import { OrderItemsTable } from "@/components/orders/order-items-table";
import { OrderPaymentCard } from "@/components/orders/order-payment-card";
import { OrderShippingCard } from "@/components/orders/order-shipping-card";
import { OrderSummaryCard } from "@/components/orders/order-summary-card";
import { OrderTimeline } from "@/components/orders/order-timeline";
import type { OrderRecord } from "@/lib/orders";

function BackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 5.5 8.5 12 15 18.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrderDetail({ order }: { order: OrderRecord }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <Link
            href="/orders"
            className="inline-flex size-8 items-center justify-center rounded-lg text-aurora-ink transition-colors hover:bg-[#f0f0f0]"
            aria-label="Back to orders"
          >
            <BackIcon />
          </Link>
          <h1 className="text-[1.5rem] font-bold tracking-tight text-aurora-ink sm:text-[1.75rem]">
            {order.id}
          </h1>
        </div>
        <p className="mt-1 ml-10 text-sm text-[#8a8a8a]">
          Placed on {order.placedAt}
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.85fr)]">
        <OrderTimeline steps={order.timeline} />

        <div className="flex flex-col gap-5">
          <OrderSummaryCard order={order} />
          <OrderPaymentCard order={order} />
          <OrderShippingCard order={order} />
          <OrderDetailActions />
        </div>
      </div>

      <OrderItemsTable order={order} />
    </div>
  );
}
