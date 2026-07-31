"use client";

import { usePermission } from "@/lib/permissions";

export function DashboardGreeting() {
  const { user } = usePermission();
  const name = user?.firstName ?? "there";

  return (
    <div>
      <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
        Hi {name},
      </h1>
      <p className="mt-1 text-sm text-[#8a8a8a]">
        Welcome back! Here&apos;s your account overview.
      </p>
    </div>
  );
}
