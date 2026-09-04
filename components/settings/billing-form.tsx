"use client";

import { useState, useSyncExternalStore } from "react";
import { CopyTrackingButton } from "@/components/cart/copy-tracking-button";
import {
  BILLING_HISTORY,
  DEFAULT_PAYMENT_METHODS,
  type PaymentMethod,
} from "@/lib/settings";
import {
  getSavedReceipts,
  type OrderReceipt,
} from "@/lib/receipts";

function subscribeReceipts(onStoreChange: () => void) {
  window.addEventListener("aurora-receipts-changed", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("aurora-receipts-changed", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function useSavedReceipts(): OrderReceipt[] {
  return useSyncExternalStore(
    subscribeReceipts,
    getSavedReceipts,
    () => [],
  );
}

function CardIcon() {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-aurora-lime text-aurora-ink"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
    </span>
  );
}

export function BillingForm() {
  const [methods, setMethods] = useState<PaymentMethod[]>(
    DEFAULT_PAYMENT_METHODS,
  );
  const receipts = useSavedReceipts();

  function handleRemove(id: string) {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  }

  const history = [
    ...receipts.map((receipt) => ({
      kind: "receipt" as const,
      id: receipt.orderId,
      date: receipt.date,
      amount: receipt.amount,
      trackingNumber: receipt.trackingNumber,
    })),
    ...BILLING_HISTORY.map((invoice) => ({
      kind: "invoice" as const,
      id: invoice.id,
      date: invoice.date,
      amount: invoice.amount,
      trackingNumber: null as string | null,
    })),
  ];

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-lg font-bold text-aurora-ink">Billing Information</h2>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-aurora-ink">Payment Methods</h3>

        <ul className="mt-4 space-y-3">
          {methods.length === 0 ? (
            <li className="rounded-xl border border-dashed border-[#d9d9d9] px-4 py-5 text-sm text-[#8a8a8a]">
              No payment methods saved yet.
            </li>
          ) : (
            methods.map((method) => (
              <li
                key={method.id}
                className="flex items-center gap-3 rounded-xl border border-[#ececec] px-3.5 py-3.5"
              >
                <CardIcon />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold tracking-wide text-aurora-ink">
                    **** **** **** {method.last4}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a8a8a]">
                    Expires {method.expires}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(method.id)}
                  className="shrink-0 text-sm font-semibold text-[#d64545] transition-opacity hover:opacity-80"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>

        <button
          type="button"
          className="mt-3 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-aurora-ink/80 bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Add Payment Method
        </button>
      </div>

      <div className="mt-7 border-t border-[#e8e8e8] pt-6">
        <h3 className="text-sm font-bold text-aurora-ink">Billing History</h3>
        <p className="mt-1 text-xs text-[#8a8a8a]">
          Receipts from placed orders are saved here.
        </p>

        <ul className="mt-4 divide-y divide-[#ececec]">
          {history.length === 0 ? (
            <li className="py-8 text-sm text-[#8a8a8a]">
              No receipts yet. Place an order to see it here.
            </li>
          ) : (
            history.map((entry) => (
              <li
                key={`${entry.kind}-${entry.id}`}
                className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-aurora-ink">
                    {entry.id.replace(/-/g, " - ")}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a8a8a]">{entry.date}</p>
                  {entry.trackingNumber ? (
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      <p className="text-xs text-[#5f5f5f]">
                        Tracking:{" "}
                        <span className="font-semibold text-aurora-ink">
                          {entry.trackingNumber}
                        </span>
                      </p>
                      <CopyTrackingButton
                        trackingNumber={entry.trackingNumber}
                        className="text-xs"
                      />
                    </div>
                  ) : null}
                </div>
                <p className="text-sm font-semibold text-aurora-ink">
                  {entry.amount}
                </p>
                {entry.kind === "invoice" ? (
                  <button
                    type="button"
                    className="text-sm font-semibold text-[#2f6fed] transition-opacity hover:opacity-80"
                  >
                    Download
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-[#1f9d57]">
                    Receipt
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
