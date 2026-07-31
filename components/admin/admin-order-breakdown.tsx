import { Card } from "@/components/ui/card";
import type { OrderBreakdownItem } from "@/lib/admin";
import { cn } from "@/lib/utils";

const TONE_BAR = {
  green: "bg-[#22c55e]",
  orange: "bg-[#e67a2e]",
  blue: "bg-[#2f6fed]",
  gray: "bg-[#9ca3af]",
} as const;

export function AdminOrderBreakdown({
  items,
}: {
  items: OrderBreakdownItem[];
}) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div>
        <h2 className="text-base font-semibold text-aurora-ink">
          Order Breakdown
        </h2>
      </div>

      <ul className="mt-5 flex flex-1 flex-col gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-aurora-ink">{item.label}</span>
              <span className="tabular-nums text-[#8a8a8a]">
                {item.count.toLocaleString()}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#f0f0f0]">
              <div
                className={cn("h-full rounded-full", TONE_BAR[item.tone])}
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
