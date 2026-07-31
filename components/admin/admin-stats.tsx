import { Card } from "@/components/ui/card";
import type { AdminStat } from "@/lib/admin";
import { cn } from "@/lib/utils";

function StatIcon({ icon }: { icon: AdminStat["icon"] }) {
  if (icon === "orders") {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#fff7e8] text-[#e6a23c]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4.5h7l3.5 3.5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M14 4.5V8h3.5M9 12.5h6M9 16h4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  if (icon === "revenue") {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e8f8ef] text-[#1f9d57]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="3.5"
            y="6"
            width="17"
            height="12"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M3.5 10h17M8 14h3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  if (icon === "active") {
    return (
      <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#2f6fed]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3.8 18c.7-2.6 2.7-3.9 5.2-3.9s4.5 1.3 5.2 3.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M15 14.2c1.5.3 2.8 1.2 3.4 3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[#f3f4f6] text-[#6b7280]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M6 18c.9-2.8 3-4.2 6-4.2s5.1 1.4 6 4.2"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M4 4l16 16"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function AdminStats({ stats }: { stats: AdminStat[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.id}
          className={cn("flex items-start justify-between gap-3 px-5 py-4")}
        >
          <div className="min-w-0">
            <p className="text-xs font-medium text-[#8a8a8a]">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-aurora-ink">
              {stat.value}
            </p>
            <p className="mt-1 text-[11px] text-[#9a9a9a]">{stat.hint}</p>
          </div>
          <StatIcon icon={stat.icon} />
        </Card>
      ))}
    </div>
  );
}
