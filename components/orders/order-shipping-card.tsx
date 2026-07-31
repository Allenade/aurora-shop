import type { OrderRecord } from "@/lib/orders";

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8.2 4.8c.4-.8 1.4-1.1 2.1-.6l1.6 1.1c.7.5.8 1.5.3 2.2l-.8 1.1a1.4 1.4 0 0 0 .1 1.7l2.4 2.4a1.4 1.4 0 0 0 1.7.1l1.1-.8c.7-.5 1.7-.4 2.2.3l1.1 1.6c.5.7.2 1.7-.6 2.1l-1.3.7c-.8.4-1.8.3-2.5-.3A16.5 16.5 0 0 1 7.8 9.3c-.6-.7-.7-1.7-.3-2.5l.7-1.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrderShippingCard({ order }: { order: OrderRecord }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">Shipping Address</h2>

      <div className="mt-5 space-y-2 text-sm">
        <p className="font-semibold text-aurora-ink">{order.shippingName}</p>
        <p className="leading-relaxed text-[#6b7280]">{order.shippingAddress}</p>
        <p className="inline-flex items-center gap-1.5 text-[#6b7280]">
          <PhoneIcon />
          {order.shippingPhone}
        </p>
      </div>
    </div>
  );
}
