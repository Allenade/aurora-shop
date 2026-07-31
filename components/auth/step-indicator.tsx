import { cn } from "@/lib/utils";
import { SIGNUP_STEPS } from "@/lib/auth";

type StepIndicatorProps = {
  current: 1 | 2;
};

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M3 7.2 5.8 10 11 4"
        stroke="#151514"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <ol className="flex w-full items-start" aria-label="Sign up progress">
      {SIGNUP_STEPS.map((step, index) => {
        const active = step.id === current;
        const done = step.id < current;
        const isLast = index === SIGNUP_STEPS.length - 1;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-start">
            <div className="flex flex-col items-start gap-2">
              <span
                className={cn(
                  "flex size-7 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-aurora-lime text-aurora-ink",
                  active && "bg-aurora-ink text-white",
                  !done && !active && "bg-[#e8e8e8] text-[#9a9a9a]",
                )}
              >
                {done ? <CheckIcon /> : step.id}
              </span>
              <span
                className={cn(
                  "text-xs font-medium whitespace-nowrap",
                  active || done ? "text-aurora-ink" : "text-[#9a9a9a]",
                )}
              >
                {step.label}
              </span>
            </div>

            {!isLast ? (
              <div
                className={cn(
                  "mx-4 mt-[13px] h-px min-w-8 flex-1",
                  done ? "bg-aurora-lime" : "bg-[#d6d6d6]",
                )}
                aria-hidden
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
