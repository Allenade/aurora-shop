"use client";

import { useEffect } from "react";
import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentPurchases } from "@/components/dashboard/recent-purchases";
import { StatCard } from "@/components/dashboard/stat-card";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import type { BuyerDashboardResponse } from "@/lib/dashboard";
import { useDashboardSession } from "@/lib/dashboard-session-store";

export function DashboardOverview() {
  const { stats, recentOrders, ready, error, isStale, apply, fail } =
    useDashboardSession();

  useEffect(() => {
    // Have cache — only soft-refresh when stale
    if (ready && !isStale()) return;

    let cancelled = false;

    void bffCall<BuyerDashboardResponse>("getBuyerDashboard")
      .then((data) => {
        if (cancelled) return;
        apply(data);
      })
      .catch((err) => {
        if (cancelled) return;
        // Keep showing cached data on soft-refresh failure
        if (ready) return;
        fail(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load dashboard.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [ready, isStale, apply, fail]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <DashboardGreeting />

      {error ? (
        <p className="text-sm font-medium text-[#d64545]" role="alert">
          {error}
        </p>
      ) : null}

      {!ready ? (
        <p className="text-sm text-[#8a8a8a]">Loading overview…</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,1fr)]">
            <RecentPurchases orders={recentOrders} />
            <QuickActions />
          </div>
        </>
      )}
    </div>
  );
}
