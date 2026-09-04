"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CopyTrackingButton } from "@/components/cart/copy-tracking-button";
import {
  formatCartMoney,
  VAT_RATE,
  type DeliveryFormState,
  type DeliveryMethod,
  type PaymentMethodId,
  PAYMENT_METHODS,
} from "@/lib/cart";
import type { ShopProduct } from "@/lib/shop";

type OrderLine = {
  product: ShopProduct;
  qty: number;
};

type OrderPlacedSuccessProps = {
  orderId: string;
  trackingNumber: string;
  form: DeliveryFormState;
  delivery: DeliveryMethod;
  paymentMethod: PaymentMethodId;
  lines: OrderLine[];
};

export function OrderPlacedSuccess({
  orderId,
  trackingNumber,
  form,
  delivery,
  paymentMethod,
  lines,
}: OrderPlacedSuccessProps) {
  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? "Payment";
  const addressLine = [form.streetAddress, form.city, form.state, "Nigeria"]
    .filter(Boolean)
    .join(", ");

  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + delivery.price + vat;

  const formattedOrderId = orderId.replace(/-/g, " - ");

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center py-2">
      <span
        className="flex size-16 items-center justify-center rounded-full bg-[#dcfce7]"
        aria-hidden
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-[#1f9d57]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="m6.5 12.5 3.5 3.5 7.5-8"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </span>

      <h1 className="mt-5 text-center text-[1.5rem] font-bold tracking-tight text-aurora-ink sm:text-[1.75rem]">
        Order Placed Successfully!
      </h1>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-[#8a8a8a]">
        Your order has been received. We&apos;ll send a confirmation email to{" "}
        <span className="font-medium text-aurora-ink">{form.email}</span>.
      </p>

      <div className="mt-7 w-full rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
              Order ID
            </p>
            <p className="mt-1 text-base font-bold text-aurora-ink">
              {formattedOrderId}
            </p>
          </div>
          <Badge tone="blue" className="rounded-md font-semibold">
            Processing Order
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#ececec] bg-[#fafafa] px-3.5 py-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
              Tracking Number
            </p>
            <p className="mt-1 text-sm font-bold text-aurora-ink">
              {trackingNumber}
            </p>
          </div>
          <CopyTrackingButton trackingNumber={trackingNumber} />
        </div>

        <ul className="mt-5 space-y-4 border-t border-[#f0f0f0] pt-5">
          {lines.map((line) => (
            <li key={line.product.id} className="flex items-center gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[#f3f3f3]">
                <Image
                  src={line.product.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-aurora-ink">
                  {line.product.name}
                </p>
                <p className="mt-0.5 text-xs text-[#8a8a8a]">Qty: {line.qty}</p>
                <p className="mt-0.5 text-xs text-[#8a8a8a]">
                  Price: {formatCartMoney(line.product.price * line.qty)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 grid gap-5 border-t border-[#f0f0f0] pt-5 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
              Deliver To
            </p>
            <p className="mt-1 text-sm font-bold text-aurora-ink">
              {form.fullName}
            </p>
            <p className="mt-0.5 text-sm leading-relaxed text-[#5f5f5f]">
              {addressLine}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
              Payment
            </p>
            <p className="mt-1 text-sm font-bold text-aurora-ink">
              {paymentLabel}
            </p>
            <p className="mt-0.5 text-sm text-[#5f5f5f]">
              {delivery.label} — {delivery.description}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#f0f0f0] pt-4">
          <span className="text-sm text-aurora-ink">Total Paid</span>
          <span className="text-lg font-bold text-aurora-ink">
            {formatCartMoney(total)}
          </span>
        </div>
      </div>

      <div className="mt-6 flex w-full flex-col gap-2.5 sm:flex-row">
        <Link
          href={`/track-orders?q=${encodeURIComponent(trackingNumber)}`}
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          Track Order
        </Link>
        <Link
          href="/shop"
          className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#d0d0d0] bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
