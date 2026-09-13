"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CopyTrackingButton } from "@/components/ui/copy-tracking-button";
import { EmptyState } from "@/components/ui/empty-state";
import { BillingFormSkeleton } from "@/components/ui/skeleton";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import type { BillingInvoice, PaymentMethod } from "@/lib/settings";

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
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void bffCall<{ methods: PaymentMethod[]; invoices: BillingInvoice[] }>(
      "getBillingSettings",
    )
      .then((data) => {
        if (cancelled) return;
        setMethods(data.methods ?? []);
        setInvoices(data.invoices ?? []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load billing information.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <BillingFormSkeleton />;
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-lg font-bold text-aurora-ink">Billing Information</h2>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-aurora-ink">Payment Methods</h3>
        <p className="mt-1 text-xs text-[#8a8a8a]">
          Cards stay with Paystack. Aurora only stores last4 authorizations.
        </p>

        <ul className="mt-4 space-y-3">
          {methods.length === 0 ? (
            <li>
              <EmptyState description="No saved Paystack authorizations yet." />
            </li>
          ) : null}
          {methods.map((method) => (
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
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 border-t border-[#e8e8e8] pt-6">
        <h3 className="text-sm font-bold text-aurora-ink">Billing History</h3>
        <p className="mt-1 text-xs text-[#8a8a8a]">
          Paid invoices from the order ledger.
        </p>

        <ul className="mt-4 divide-y divide-[#ececec]">
          {invoices.length === 0 ? (
            <li className="py-2">
              <EmptyState description="No paid invoices yet." />
            </li>
          ) : null}
          {invoices.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-3"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-aurora-ink">
                  {entry.id.replace(/-/g, " - ")}
                </p>
                <p className="mt-0.5 text-xs text-[#8a8a8a]">{entry.date}</p>
                {entry.trackingNumber ? (
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/track-orders?q=${encodeURIComponent(entry.trackingNumber)}`}
                      className="text-xs font-medium text-[#2f6fed] underline-offset-2 hover:underline"
                    >
                      {entry.trackingNumber}
                    </Link>
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
              <span className="text-xs font-semibold text-[#1f9d57]">
                {entry.status ?? "Paid"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
