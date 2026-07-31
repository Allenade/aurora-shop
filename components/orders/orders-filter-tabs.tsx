"use client";

import { cn } from "@/lib/utils";
import type { OrderFilter } from "@/lib/orders";

type OrdersFilterTabsProps = {
  value: OrderFilter;
  onChange: (value: OrderFilter) => void;
  counts: Record<OrderFilter, number>;
};

const TABS: { value: OrderFilter; label: string }[] = [
  { value: "all", label: "All Orders" },
  { value: "completed", label: "Completed" },
  { value: "pending", label: "Pending" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrdersFilterTabs({
  value,
  onChange,
  counts,
}: OrdersFilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist">
      {TABS.map((tab) => {
        const active = value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-sm font-semibold transition-colors",
              active
                ? "bg-aurora-lime text-aurora-ink"
                : "text-[#6b7280] hover:bg-[#f3f3f3] hover:text-aurora-ink",
            )}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
            {tab.value === "all" && active ? (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path
                  d="M2.5 4.5 6 8l3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <span
                className={cn(
                  "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold",
                  active
                    ? "bg-aurora-ink/10 text-aurora-ink"
                    : "bg-[#ececec] text-[#6b7280]",
                )}
              >
                {counts[tab.value]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
