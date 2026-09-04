import {
  formatCartMoney,
  VAT_RATE,
  PAYMENT_METHODS,
  type DeliveryFormState,
  type DeliveryMethod,
  type PaymentMethodId,
} from "@/lib/cart";
import type { ShopProduct } from "@/lib/shop";

const STORAGE_KEY = "aurora-shop-receipts";

export type ReceiptLine = {
  name: string;
  qty: number;
  priceLabel: string;
  image: string;
};

export type OrderReceipt = {
  orderId: string;
  trackingNumber: string;
  date: string;
  amount: string;
  amountValue: number;
  customerName: string;
  email: string;
  address: string;
  paymentLabel: string;
  deliveryLabel: string;
  items: ReceiptLine[];
};

export function createTrackingNumber() {
  return `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
}

function readReceipts(): OrderReceipt[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderReceipt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeReceipts(receipts: OrderReceipt[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(receipts));
  window.dispatchEvent(new Event("aurora-receipts-changed"));
}

export function getSavedReceipts(): OrderReceipt[] {
  return readReceipts();
}

export function getReceiptByTracking(trackingNumber: string) {
  const normalized = trackingNumber.trim().toUpperCase();
  return (
    readReceipts().find(
      (r) =>
        r.trackingNumber.toUpperCase() === normalized ||
        r.orderId.toUpperCase() === normalized,
    ) ?? null
  );
}

export function saveOrderReceipt(receipt: OrderReceipt) {
  const existing = readReceipts().filter(
    (r) => r.orderId !== receipt.orderId,
  );
  writeReceipts([receipt, ...existing]);
}

type BuildReceiptInput = {
  orderId: string;
  trackingNumber: string;
  form: DeliveryFormState;
  delivery: DeliveryMethod;
  paymentMethod: PaymentMethodId;
  lines: { product: ShopProduct; qty: number }[];
};

export function buildOrderReceipt({
  orderId,
  trackingNumber,
  form,
  delivery,
  paymentMethod,
  lines,
}: BuildReceiptInput): OrderReceipt {
  const subtotal = lines.reduce(
    (sum, line) => sum + line.product.price * line.qty,
    0,
  );
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + delivery.price + vat;
  const paymentLabel =
    PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label ?? "Payment";
  const address = [form.streetAddress, form.city, form.state, "Nigeria"]
    .filter(Boolean)
    .join(", ");

  return {
    orderId,
    trackingNumber,
    date: new Date().toLocaleDateString("en-CA"),
    amount: formatCartMoney(total),
    amountValue: total,
    customerName: form.fullName,
    email: form.email,
    address,
    paymentLabel,
    deliveryLabel: `${delivery.label} — ${delivery.description}`,
    items: lines.map((line) => ({
      name: line.product.name,
      qty: line.qty,
      priceLabel: formatCartMoney(line.product.price * line.qty),
      image: line.product.image,
    })),
  };
}
