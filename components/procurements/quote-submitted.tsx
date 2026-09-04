import Link from "next/link";
import { AuroraLogo } from "@/components/auth/aurora-logo";
import { Badge } from "@/components/ui/badge";
import type { QuoteFormState } from "@/components/procurements/quote-request-form";

export type SubmittedQuote = QuoteFormState & {
  referenceNumber: string;
};

const NEXT_STEPS = [
  {
    title: "Review",
    description:
      "Our procurement team will review your requirements and specifications within 24 hours.",
  },
  {
    title: "Quote Preparation",
    description:
      "We'll prepare a detailed quote based on your requested components and quantities.",
  },
  {
    title: "Delivery",
    description:
      "You'll receive the quote via email. Our team will follow up to discuss next steps.",
  },
] as const;

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold wrap-break-word text-aurora-ink">
        {value || "—"}
      </p>
    </div>
  );
}

type QuoteSubmittedProps = {
  quote: SubmittedQuote;
  onSubmitAnother: () => void;
};

export function QuoteSubmitted({ quote, onSubmitAnother }: QuoteSubmittedProps) {
  const phoneDisplay = quote.phone.trim()
    ? `+234 ${quote.phone.trim()}`
    : "—";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col items-center rounded-2xl border border-[#e8e8e8] bg-white px-5 py-8 sm:px-8 sm:py-10">
      <AuroraLogo href="/dashboard" className="mb-6" />

      <span
        className="flex size-14 items-center justify-center rounded-full bg-[#1f9d57]"
        aria-hidden
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="m6.5 12.5 3.5 3.5 7.5-8"
            stroke="white"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <h1 className="mt-5 text-center text-[1.5rem] font-bold tracking-tight text-aurora-ink sm:text-[1.75rem]">
        Quote Request Submitted
      </h1>
      <p className="mt-2 max-w-md text-center text-sm leading-relaxed text-[#8a8a8a]">
        Your quote request has been received and is being reviewed by our
        procurement team. We&apos;ll get back to you within 24-48 hours.
      </p>

      <div className="mt-7 w-full rounded-xl border border-[#e8e8e8] p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-[#9a9a9a] uppercase">
              Reference Number
            </p>
            <p className="mt-1 text-lg font-bold text-aurora-ink">
              {quote.referenceNumber}
            </p>
          </div>
          <Badge tone="green">Submitted</Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Detail label="Company Name" value={quote.companyName} />
          <Detail label="Contact Person" value={quote.contactPerson} />
          <Detail label="Email Address" value={quote.email} />
          <Detail label="Phone Number" value={phoneDisplay} />
          <Detail label="Component Specifications" value={quote.components} />
          <Detail label="Estimated Quantity" value={quote.quantity} />
        </div>
      </div>

      <div className="mt-7 w-full">
        <h2 className="text-base font-bold text-aurora-ink">
          What Happens Next?
        </h2>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-aurora-lime text-xs font-bold text-aurora-ink">
                {index + 1}
              </span>
              <div>
                <p className="text-sm font-bold text-aurora-ink">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[#8a8a8a]">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8 flex w-full flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={onSubmitAnother}
          className="inline-flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          Submit Another Request
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Back To Dashboard
        </Link>
      </div>
    </div>
  );
}
