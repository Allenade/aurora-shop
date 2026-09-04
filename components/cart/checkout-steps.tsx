import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  step: 1 | 2;
};

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckoutSteps({ step }: CheckoutStepsProps) {
  const step1Done = step === 2;

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-xs font-bold",
            step === 1 && "bg-aurora-lime text-aurora-ink",
            step1Done && "bg-[#1f9d57] text-white",
            step !== 1 && !step1Done && "bg-[#e8e8e8] text-[#8a8a8a]",
          )}
        >
          {step1Done ? <CheckIcon /> : "1"}
        </span>
        <span
          className={cn(
            "text-sm font-semibold",
            step === 1 && "text-aurora-ink",
            step1Done && "text-[#1f9d57]",
            step !== 1 && !step1Done && "text-[#8a8a8a]",
          )}
        >
          Delivery Details
        </span>
      </div>

      <span
        className={cn(
          "hidden h-px w-10 sm:block",
          step1Done ? "bg-[#1f9d57]" : "bg-[#e0e0e0]",
        )}
        aria-hidden
      />

      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-full text-xs font-bold",
            step === 2
              ? "bg-aurora-lime text-aurora-ink"
              : "bg-[#e8e8e8] text-[#8a8a8a]",
          )}
        >
          2
        </span>
        <span
          className={cn(
            "text-sm font-semibold",
            step === 2 ? "text-aurora-ink" : "text-[#8a8a8a]",
          )}
        >
          Review & Payment
        </span>
      </div>
    </div>
  );
}
