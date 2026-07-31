import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { StockAlert, StockAlertLevel } from "@/lib/admin";
import { cn } from "@/lib/utils";

function levelTone(level: StockAlertLevel) {
  if (level === "CRITICAL") return "red" as const;
  if (level === "LOW STOCK") return "orange" as const;
  return "gray" as const;
}

function barTone(level: StockAlertLevel) {
  if (level === "CRITICAL") return "bg-[#d64545]";
  if (level === "LOW STOCK") return "bg-[#e67a2e]";
  return "bg-transparent";
}

export function AdminStockAlerts({ alerts }: { alerts: StockAlert[] }) {
  return (
    <Card className="flex h-full flex-col p-5">
      <div>
        <h2 className="text-base font-semibold text-aurora-ink">Stock Alerts</h2>
      </div>

      <ul className="mt-4 flex flex-1 flex-col gap-3">
        {alerts.map((alert) => (
          <li
            key={alert.id}
            className="rounded-xl border border-[#ececec] px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 truncate text-sm font-semibold text-aurora-ink">
                {alert.name}
              </p>
              <Badge
                tone={levelTone(alert.level)}
                className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
              >
                {alert.level}
              </Badge>
            </div>

            {/* Number on top of the status line — matches Figma */}
            <div className="mt-3">
              <p className="text-sm font-semibold whitespace-nowrap tabular-nums text-aurora-ink">
                {alert.qty}
                <span className="font-medium text-[#9a9a9a]">
                  {" "}
                  / min {alert.minStock}
                </span>
              </p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#ececec]">
                <div
                  className={cn("h-full rounded-full", barTone(alert.level))}
                  style={{ width: `${alert.fillPercent}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
