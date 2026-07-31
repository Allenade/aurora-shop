import type { OrderRecord } from "@/lib/orders";

export function OrderSummaryCard({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">Order Summary</h2>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Subtotal ({order.itemCount} items)</dt>
          <dd className="font-medium text-aurora-ink">{order.subtotalLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Shipping</dt>
          <dd className="font-medium text-aurora-ink">{order.shippingLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[#6b7280]">Tax (VAT 7.5%)</dt>
          <dd className="font-medium text-aurora-ink">{order.taxLabel}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-[#ececec] pt-4">
        <span className="text-sm font-semibold text-aurora-ink">Total</span>
        <span className="text-xl font-bold text-aurora-ink">{order.total}</span>
      </div>
    </div>
  );
}
