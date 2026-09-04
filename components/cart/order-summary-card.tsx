import Image from "next/image";
import { formatCartMoney, VAT_RATE, type DeliveryMethod } from "@/lib/cart";
import type { ShopProduct } from "@/lib/shop";

export type OrderSummaryLine = {
  product: ShopProduct;
  qty: number;
};

type OrderSummaryCardProps = {
  lines: OrderSummaryLine[];
  delivery: DeliveryMethod;
};

export function OrderSummaryCard({ lines, delivery }: OrderSummaryCardProps) {
  const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + delivery.price + vat;

  return (
    <aside className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">Order Summary</h2>

      <ul className="mt-4 space-y-4">
        {lines.map((line) => (
          <li key={line.product.id} className="flex items-center gap-3">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-[#f3f3f3]">
              <Image
                src={line.product.image}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-aurora-ink">
                {line.product.name}
              </p>
              <p className="mt-0.5 text-xs text-[#8a8a8a]">Qty: {line.qty}</p>
            </div>
            <p className="shrink-0 text-sm font-semibold text-aurora-ink">
              {formatCartMoney(line.product.price * line.qty)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2.5 border-t border-[#f0f0f0] pt-4 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8a8a8a]">
            Subtotal ({itemCount} item{itemCount === 1 ? "" : "s"})
          </span>
          <span className="font-medium text-aurora-ink">
            {formatCartMoney(subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8a8a8a]">Delivery</span>
          <span className="font-medium text-aurora-ink">
            {formatCartMoney(delivery.price)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-[#8a8a8a]">VAT (7.5%)</span>
          <span className="font-medium text-aurora-ink">
            {formatCartMoney(vat)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-4">
        <span className="text-sm font-bold text-aurora-ink">Total</span>
        <span className="text-lg font-bold text-aurora-ink">
          {formatCartMoney(total)}
        </span>
      </div>
    </aside>
  );
}
