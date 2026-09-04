"use client";

import { Field, TextInput } from "@/components/auth/form-controls";

export type CardFormState = {
  cardholderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
};

export const INITIAL_CARD_FORM: CardFormState = {
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

type CardPaymentFormProps = {
  form: CardFormState;
  errors: Partial<Record<keyof CardFormState, string>>;
  onChange: <K extends keyof CardFormState>(
    key: K,
    value: CardFormState[K],
  ) => void;
};

function requiredLabel(text: string) {
  return (
    <>
      {text} <span className="text-[#d64545]">*</span>
    </>
  );
}

function CardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="2.5"
        y="5"
        width="19"
        height="14"
        rx="2.5"
        stroke="#c9a227"
        strokeWidth="1.6"
      />
      <path
        d="M2.5 10h19M7 15h4"
        stroke="#c9a227"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

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

function CardBrandMarks() {
  return (
    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-1.5">
      <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden>
        <rect width="28" height="18" rx="3" fill="#1A1F71" />
        <text
          x="14"
          y="12.5"
          textAnchor="middle"
          fill="white"
          fontSize="7"
          fontWeight="700"
          fontFamily="system-ui,sans-serif"
        >
          VISA
        </text>
      </svg>
      <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden>
        <rect width="28" height="18" rx="3" fill="#F5F5F5" stroke="#E5E5E5" />
        <circle cx="11.5" cy="9" r="5" fill="#EB001B" />
        <circle cx="16.5" cy="9" r="5" fill="#F79E1B" />
        <path
          d="M14 5.2a5 5 0 0 1 0 7.6 5 5 0 0 1 0-7.6Z"
          fill="#FF5F00"
        />
      </svg>
      <svg width="28" height="18" viewBox="0 0 28 18" aria-hidden>
        <rect width="28" height="18" rx="3" fill="#0A4F9E" />
        <text
          x="14"
          y="12.5"
          textAnchor="middle"
          fill="white"
          fontSize="5.5"
          fontWeight="700"
          fontFamily="system-ui,sans-serif"
        >
          VERVE
        </text>
      </svg>
    </span>
  );
}

export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function formatCvv(value: string) {
  return value.replace(/\D/g, "").slice(0, 4);
}

export function validateCardForm(form: CardFormState) {
  const next: Partial<Record<keyof CardFormState, string>> = {};
  if (!form.cardholderName.trim()) {
    next.cardholderName = "Cardholder name is required";
  }

  const digits = form.cardNumber.replace(/\s/g, "");
  if (!digits) next.cardNumber = "Card number is required";
  else if (digits.length < 13) next.cardNumber = "Enter a valid card number";

  if (!form.expiry.trim()) next.expiry = "Expiry is required";
  else if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
    next.expiry = "Use MM/YY";
  } else {
    const [mm, yy] = form.expiry.split("/").map(Number);
    if (!mm || mm < 1 || mm > 12) next.expiry = "Invalid month";
    else {
      const now = new Date();
      const exp = new Date(2000 + (yy ?? 0), mm, 0);
      if (exp < new Date(now.getFullYear(), now.getMonth(), 1)) {
        next.expiry = "Card has expired";
      }
    }
  }

  if (!form.cvv.trim()) next.cvv = "CVV is required";
  else if (form.cvv.length < 3) next.cvv = "Enter a valid CVV";

  return next;
}

export function CardPaymentForm({
  form,
  errors,
  onChange,
}: CardPaymentFormProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <div className="flex flex-col items-center text-center">
        <CardIcon />
        <h2 className="mt-3 text-xl font-bold text-aurora-ink">Card Payment</h2>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Enter your card details to pay securely via Paystack
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label={requiredLabel("Cardholder Name")}
          htmlFor="cardholder-name"
          error={errors.cardholderName}
        >
          <TextInput
            id="cardholder-name"
            name="cardholderName"
            autoComplete="cc-name"
            placeholder="Tunde Darlington Elemono Ajibade"
            value={form.cardholderName}
            invalid={Boolean(errors.cardholderName)}
            onChange={(e) => onChange("cardholderName", e.target.value)}
          />
        </Field>

        <Field
          label={requiredLabel("Card Number")}
          htmlFor="card-number"
          error={errors.cardNumber}
        >
          <div className="relative">
            <TextInput
              id="card-number"
              name="cardNumber"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="0000 0000 0000 0000"
              value={form.cardNumber}
              invalid={Boolean(errors.cardNumber)}
              className="pr-30"
              onChange={(e) =>
                onChange("cardNumber", formatCardNumber(e.target.value))
              }
            />
            <CardBrandMarks />
          </div>
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={requiredLabel("Expiry Date")}
            htmlFor="card-expiry"
            error={errors.expiry}
          >
            <TextInput
              id="card-expiry"
              name="expiry"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={form.expiry}
              invalid={Boolean(errors.expiry)}
              onChange={(e) => onChange("expiry", formatExpiry(e.target.value))}
            />
          </Field>

          <Field
            label={requiredLabel("CVV")}
            htmlFor="card-cvv"
            error={errors.cvv}
          >
            <TextInput
              id="card-cvv"
              name="cvv"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              value={form.cvv}
              invalid={Boolean(errors.cvv)}
              onChange={(e) => onChange("cvv", formatCvv(e.target.value))}
            />
          </Field>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-[#5f5f5f]">
        <span className="mt-0.5 shrink-0">
          <ShieldIcon />
        </span>
        <p>
          Your card details are encrypted and secured by Paystack. We never
          store your card information.
        </p>
      </div>
    </div>
  );
}
