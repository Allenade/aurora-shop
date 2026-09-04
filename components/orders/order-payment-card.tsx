import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { OrderRecord } from "@/lib/orders";

function paymentTone(status: OrderRecord["paymentStatus"]) {
  if (status === "Paid") return "green" as const;
  if (status === "Refunded") return "gray" as const;
  return "orange" as const;
}

export function OrderPaymentCard({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">Payment</h2>

      <dl className="mt-5 space-y-3.5 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Method</dt>
          <dd className="font-medium text-aurora-ink">{order.paymentMethod}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Status</dt>
          <dd>
            <Badge tone={paymentTone(order.paymentStatus)}>
              {order.paymentStatus}
            </Badge>
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Tracking Number</dt>
          <dd>
            <Link
              href={`/track-orders?q=${encodeURIComponent(order.trackingNumber)}`}
              className="font-medium text-[#2f6fed] underline-offset-2 hover:underline"
            >
              {order.trackingNumber}
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
