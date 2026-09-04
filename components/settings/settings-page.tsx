"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BillingForm } from "@/components/settings/billing-form";
import { NotificationsForm } from "@/components/settings/notifications-form";
import { ProfileForm } from "@/components/settings/profile-form";
import { SecurityForm } from "@/components/settings/security-form";
import { SettingsNav } from "@/components/settings/settings-nav";
import { parseSettingsTab, type SettingsTab } from "@/lib/settings";

function SettingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = parseSettingsTab(searchParams.get("tab"));

  function setTab(next: SettingsTab) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "profile") {
      params.delete("tab");
    } else {
      params.set("tab", next);
    }
    const query = params.toString();
    router.replace(query ? `/settings?${query}` : "/settings", {
      scroll: false,
    });
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Settings
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 rounded-2xl border border-[#e5e5e5] bg-white lg:w-[220px]">
          <SettingsNav active={tab} onChange={setTab} />
        </div>

        <div className="min-w-0 flex-1 rounded-2xl border border-[#e5e5e5] bg-white">
          {tab === "profile" ? <ProfileForm /> : null}
          {tab === "security" ? <SecurityForm /> : null}
          {tab === "notifications" ? <NotificationsForm /> : null}
          {tab === "billings" ? <BillingForm /> : null}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-5xl py-10 text-sm text-[#8a8a8a]">
          Loading…
        </div>
      }
    >
      <SettingsContent />
    </Suspense>
  );
}
