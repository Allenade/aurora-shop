"use client";

type CardPaymentFormProps = {
  authorizationUrl?: string | null;
  onPay?: () => void;
};

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 19 6.5v5.2c0 4.4-2.9 7.4-7 8.8-4.1-1.4-7-4.4-7-8.8V6.5L12 3.5Z"
        stroke="#1f9d57"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12 1.9 1.9 3.7-3.8"
        stroke="#1f9d57"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CardPaymentForm({
  authorizationUrl,
  onPay,
}: CardPaymentFormProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-xl font-bold text-aurora-ink">Pay with Paystack</h2>
      <p className="mt-1 text-sm text-[#8a8a8a]">
        Card details are collected by Paystack. Aurora never sees your PAN or
        CVV.
      </p>
      <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#f4fff6] px-4 py-3 text-sm text-[#1f9d57]">
        <ShieldIcon />
        Encrypted checkout. Payment is confirmed by webhook, not this browser.
      </div>
      {authorizationUrl ? (
        <a
          href={authorizationUrl}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink"
        >
          Continue to Paystack
        </a>
      ) : (
        <button
          type="button"
          onClick={onPay}
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink"
        >
          Start secure card payment
        </button>
      )}
    </div>
  );
}
