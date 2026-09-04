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
              "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-sm font-semibold transition-colors",
              active
                ? "bg-aurora-lime text-aurora-ink"
                : "text-[#6b7280] hover:bg-[#f3f3f3] hover:text-aurora-ink",
            )}
          >
            <span className="whitespace-nowrap">{tab.label}</span>
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
          </button>
        );
      })}
    </div>
  );
}
