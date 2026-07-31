import type { OrderTimelineStep } from "@/lib/orders";
import { cn } from "@/lib/utils";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrderTimeline({ steps }: { steps: OrderTimelineStep[] }) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">Order Timeline</h2>

      <ol className="mt-6 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const done = step.status === "done";
          const current = step.status === "current";
          const active = done || current;

          return (
            <li key={step.id} className="relative flex gap-3.5 pb-6 last:pb-0">
              {!isLast ? (
                <span
                  className={cn(
                    "absolute top-7 left-[11px] h-[calc(100%-1.25rem)] w-0.5",
                    done ? "bg-[#22c55e]" : "bg-[#e5e5e5]",
                  )}
                  aria-hidden
                />
              ) : null}

              <span
                className={cn(
                  "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                  done && "bg-[#22c55e]",
                  current && "border-2 border-[#22c55e] bg-white",
                  !active && "border-2 border-[#d4d4d4] bg-white",
                )}
              >
                {done ? <CheckIcon /> : null}
                {current ? (
                  <span className="size-2 rounded-full bg-[#22c55e]" />
                ) : null}
              </span>

              <div className="min-w-0 pt-0.5">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    active ? "text-aurora-ink" : "text-[#9a9a9a]",
                  )}
                >
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-[#9a9a9a]">{step.at}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
