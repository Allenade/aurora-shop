import Image from "next/image";
import {
  formatCartMoney,
  type DeliveryFormState,
  type DeliveryMethod,
  type PaymentMethodId,
  PAYMENT_METHODS,
} from "@/lib/cart";
import type { ShopProduct } from "@/lib/shop";
import { cn } from "@/lib/utils";

type CartLine = {
  product: ShopProduct;
  qty: number;
};

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 8.5V7a5 5 0 0 1 10 0v1.5M6 8.5h12l.7 11a1.5 1.5 0 0 1-1.5 1.6H6.8a1.5 1.5 0 0 1-1.5-1.6L6 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 7.5h10V16H3V7.5Zm10 3h3.6L19.5 13v3H13M7 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm9.2 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M3 18h18M12 4l9 6H3l9-6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaymentCardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M3.5 10h17M7 14.5h4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const PAYMENT_DETAILS: Record<PaymentMethodId, string> = {
  bank: "Pay directly to our bank account. Order ships after confirmation.",
  card: "Pay securely with your debit or credit card.",
};

type ReviewPaymentProps = {
  form: DeliveryFormState;
  delivery: DeliveryMethod;
  lines: CartLine[];
  paymentMethod: PaymentMethodId;
  onPaymentChange: (id: PaymentMethodId) => void;
  onEdit: () => void;
};

export function ReviewPayment({
  form,
  delivery,
  lines,
  paymentMethod,
  onPaymentChange,
  onEdit,
}: ReviewPaymentProps) {
  const addressLine = [form.streetAddress, form.city, form.state, "Nigeria"]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <h2 className="inline-flex items-center gap-2 text-base font-bold text-aurora-ink">
            <span className="text-[#1f9d57]">
              <PinIcon />
            </span>
            Delivery To
          </h2>
          <button
            type="button"
            onClick={onEdit}
            className="text-sm font-semibold text-[#2f6fed] transition-opacity hover:opacity-80"
          >
            Edit
          </button>
        </div>

        <div className="mt-4 space-y-1 text-sm">
          <p className="font-bold text-aurora-ink">{form.fullName}</p>
          <p className="text-[#5f5f5f]">{addressLine}</p>
          <p className="text-[#5f5f5f]">+234 {form.phone}</p>
          <p className="text-[#5f5f5f]">{form.email}</p>
          {form.note.trim() ? (
            <p className="pt-1 text-[#5f5f5f]">
              <span className="font-medium text-aurora-ink">Note:</span>{" "}
              {form.note}
            </p>
          ) : null}
        </div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-aurora-lime bg-[#f3ffc7] px-3 py-2 text-xs font-semibold text-aurora-ink">
          <span className="text-[#1f9d57]">
            <TruckIcon />
          </span>
          {delivery.label} · {delivery.description}
        </div>
      </div>

      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-aurora-ink">
          <BagIcon />
          Order Items
        </h2>

        <ul className="mt-4 divide-y divide-[#f0f0f0]">
          {lines.map((line) => (
            <li
              key={line.product.id}
              className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
            >
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
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-aurora-ink">
                    {line.product.name}
                  </p>
                  {line.product.stockStatus !== "out_of_stock" ? (
                    <span className="rounded-full bg-[#e8f8ef] px-2 py-0.5 text-[10px] font-semibold text-[#1f9d57]">
                      Available
                    </span>
                  ) : (
                    <span className="rounded-full bg-[#fff1f1] px-2 py-0.5 text-[10px] font-semibold text-[#d64545]">
                      Out of Stock
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-[#8a8a8a]">
                  {line.product.subtitle}
                </p>
                <p className="mt-1 text-xs font-medium text-[#5f5f5f]">
                  Qty: {line.qty}
                </p>
              </div>
              <p className="shrink-0 text-sm font-semibold text-aurora-ink">
                {formatCartMoney(line.product.price * line.qty)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
        <h2 className="inline-flex items-center gap-2 text-base font-bold text-aurora-ink">
          <CardIcon />
          Payment Method
        </h2>

        <div className="mt-4 space-y-3">
          {PAYMENT_METHODS.map((method) => {
            const selected = paymentMethod === method.id;
            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentChange(method.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                  selected
                    ? "border-aurora-lime bg-[#f3ffc7]"
                    : "border-[#e5e5e5] bg-white hover:border-[#d0d0d0]",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    selected
                      ? "bg-aurora-lime text-aurora-ink"
                      : "bg-[#f3f3f3] text-[#5f5f5f]",
                  )}
                >
                  {method.id === "bank" ? <BankIcon /> : <PaymentCardIcon />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-aurora-ink">
                    {method.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-[#8a8a8a]">
                    {PAYMENT_DETAILS[method.id]}
                  </span>
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                    selected
                      ? "border-aurora-lime"
                      : "border-[#d0d0d0] bg-white",
                  )}
                  aria-hidden
                >
                  {selected ? (
                    <span className="size-2.5 rounded-full bg-aurora-lime" />
                  ) : null}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
