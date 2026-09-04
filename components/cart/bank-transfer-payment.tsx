"use client";

import { CopyValueButton } from "@/components/cart/copy-value-button";
import {
  BANK_TRANSFER_DETAILS,
  formatCartMoneyCompact,
} from "@/lib/cart";

type BankTransferPaymentProps = {
  amount: number;
  transferReference: string;
  payerName: string;
};

function BankBuildingIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 10h16M6 10v8M10 10v8M14 10v8M18 10v8M3 18h18M12 4l9 6H3l9-6Z"
        stroke="#c9a227"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const DETAIL_ROWS = [
  { key: "bank", label: "Bank", valueKey: "bank" as const },
  {
    key: "accountName",
    label: "Account Name",
    valueKey: "accountName" as const,
  },
  {
    key: "accountNumber",
    label: "Account Number",
    valueKey: "accountNumber" as const,
  },
] as const;

export function BankTransferPayment({
  amount,
  transferReference,
  payerName,
}: BankTransferPaymentProps) {
  const displayName = payerName.trim() || "the account holder";

  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <BankBuildingIcon />
        <h2 className="mt-3 text-xl font-bold text-aurora-ink">Bank Transfer</h2>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Transfer the exact amount using the details below.
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-[#f5c6c6] bg-[#fff5f5] px-4 py-4 text-center sm:px-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#d64545]">
          Amount to Transfer
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-aurora-ink sm:text-[2rem]">
          {formatCartMoneyCompact(amount)}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#d64545]">
          Use your Order ID as the narration so we can match your payment
          quickly
        </p>
      </div>

      <div className="mt-2 divide-y divide-[#f0f0f0]">
        {DETAIL_ROWS.map((row) => (
          <div
            key={row.key}
            className="flex items-center justify-between gap-3 py-4"
          >
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
                {row.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-aurora-ink">
                {BANK_TRANSFER_DETAILS[row.valueKey]}
              </p>
            </div>
            <CopyValueButton value={BANK_TRANSFER_DETAILS[row.valueKey]} />
          </div>
        ))}

        <div className="flex items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8a8a8a]">
              Transfer Narration / Reference
            </p>
            <p className="mt-1 text-sm font-semibold text-aurora-ink">
              {transferReference}
            </p>
          </div>
          <CopyValueButton value={transferReference} />
        </div>
      </div>

      <div className="mt-2 rounded-xl border border-[#f0d4a8] bg-[#fff8ee] px-4 py-4">
        <p className="text-sm font-bold text-aurora-ink">Important</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-4 text-xs leading-relaxed text-[#5f5f5f]">
          <li>
            Transfer must be made from an account bearing &apos;{displayName}
            &apos; or a related name.
          </li>
          <li>
            Your order will be confirmed within 2 business hours after we
            receive the payment.
          </li>
          <li>
            Orders not paid within 24 hours may be automatically cancelled.
          </li>
        </ul>
      </div>
    </div>
  );
}
