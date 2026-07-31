import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentPurchases } from "@/components/dashboard/recent-purchases";
import { StatCard } from "@/components/dashboard/stat-card";
import { DASHBOARD_STATS, RECENT_ORDERS } from "@/lib/dashboard";

export function DashboardOverview() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <DashboardGreeting />

      <div className="grid gap-4 md:grid-cols-3">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
        <RecentPurchases orders={RECENT_ORDERS} />
        <QuickActions />
      </div>
    </div>
  );
}
