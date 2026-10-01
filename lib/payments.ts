import { bffCall } from "@/lib/bff/generated/client";

/** Buyer-facing label. `bank` is Paystack Pay with Transfer, not our account. */
export function displayPaymentMethod(method: string) {
  const normalized = method.trim().toLowerCase();
  if (normalized === "card" || normalized === "debit/credit card") return "Card";
  if (
    normalized === "bank" ||
    normalized === "bank transfer" ||
    normalized === "pay with transfer"
  ) {
    return "Pay with Transfer";
  }
  return method;
}

export type ShopPaymentStatus = {
  reference: string;
  provider: "paystack" | "bank";
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  paid: boolean;
  amount?: number;
  orderId?: string;
  orderNumber?: string;
  trackingNumber?: string;
  paymentStatus?: string;
};

export type ShopPaymentOutcome =
  | { kind: "paid"; status: ShopPaymentStatus }
  | { kind: "failed"; status: ShopPaymentStatus }
  | { kind: "pending"; status: ShopPaymentStatus | null };

export function isTerminalPaymentFailure(status: ShopPaymentStatus["status"]) {
  return (
    status === "failed" || status === "cancelled" || status === "refunded"
  );
}

/** Copy for the admin re-verify action. Pending must not be treated as paid. */
export function adminReverifyMessage(status: ShopPaymentStatus) {
  if (status.paid || status.status === "success") {
    return "Paystack verified this payment.";
  }
  if (status.status === "failed") {
    return "Paystack reports this payment as failed. It was not marked as paid.";
  }
  if (status.status === "cancelled") {
    return "Paystack reports this payment as cancelled. It was not marked as paid.";
  }
  if (status.status === "refunded") {
    return "Paystack reports this payment as refunded.";
  }
  return "Paystack has not confirmed this payment yet. It was not marked as paid.";
}

export function displayPaymentStanding(
  status: ShopPaymentStatus,
): "Paid" | "Unpaid" | "Refunded" {
  if (
    status.paid ||
    status.status === "success" ||
    status.paymentStatus === "paid"
  ) {
    return "Paid";
  }
  if (status.status === "refunded" || status.paymentStatus === "refunded") {
    return "Refunded";
  }
  return "Unpaid";
}

export async function fetchTransactionStatus(reference: string) {
  return bffCall<ShopPaymentStatus>("getTransactionStatus", {
    params: { reference },
  });
}

/**
 * Poll GET /transactions/:reference/status until Paystack settles the charge.
 * Pending (including Pay with Transfer) stays pending — it is not success.
 */
export async function pollTransactionStatus(
  reference: string,
  options: {
    attempts: number;
    delayMs: number;
    isCancelled: () => boolean;
  },
): Promise<ShopPaymentOutcome> {
  let last: ShopPaymentStatus | null = null;
  for (let attempt = 0; attempt < options.attempts; attempt += 1) {
    if (options.isCancelled()) return { kind: "pending", status: last };
    try {
      const status = await fetchTransactionStatus(reference);
      last = status;
      if (status.paid || status.status === "success") {
        return { kind: "paid", status };
      }
      if (isTerminalPaymentFailure(status.status)) {
        return { kind: "failed", status };
      }
    } catch {
      // Verification can lag the redirect; keep polling.
    }
    if (attempt < options.attempts - 1) {
      await new Promise((resolve) =>
        window.setTimeout(resolve, options.delayMs),
      );
      if (options.isCancelled()) return { kind: "pending", status: last };
    }
  }
  return { kind: "pending", status: last };
}
