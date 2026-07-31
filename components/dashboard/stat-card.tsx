import { Card } from "@/components/ui/card";
import type { DashboardStat } from "@/lib/dashboard";

function StatIcon({ icon }: { icon: DashboardStat["icon"] }) {
  if (icon === "bag") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7.5 8.5V7a4.5 4.5 0 0 1 9 0v1.5M6 8.5h12l.7 11a1.5 1.5 0 0 1-1.5 1.6H6.8a1.5 1.5 0 0 1-1.5-1.6l.7-11Z"
          stroke="#151514"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === "clock") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="#151514" strokeWidth="1.7" />
        <path
          d="M12 8v4.5l3 1.5"
          stroke="#151514"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 8h12M8 8v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8M10 8V6.5A2.5 2.5 0 0 1 12.5 4h0A2.5 2.5 0 0 1 15 6.5V8"
        stroke="#151514"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({ stat }: { stat: DashboardStat }) {
  return (
    <Card className="flex items-start justify-between px-5 py-5">
      <div>
        <p className="text-sm text-[#8a8a8a]">{stat.label}</p>
        <p className="mt-2 text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          {stat.value}
        </p>
        {stat.trend ? (
          <p className="mt-2 text-xs font-medium text-[#1f9d57]">{stat.trend}</p>
        ) : null}
      </div>
      <span className="flex size-10 items-center justify-center rounded-full bg-aurora-lime">
        <StatIcon icon={stat.icon} />
      </span>
    </Card>
  );
}
