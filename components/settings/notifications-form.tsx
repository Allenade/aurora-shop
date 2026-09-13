"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferenceId,
} from "@/lib/settings";
import { NotificationsFormSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50",
        checked ? "bg-aurora-lime" : "bg-[#d4d4d4]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-6 rounded-full bg-white shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function NotificationsForm() {
  const [prefs, setPrefs] = useState(DEFAULT_NOTIFICATION_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<NotificationPreferenceId | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    void bffCall<Record<string, boolean>>("getNotificationSettings")
      .then((flags) => {
        if (cancelled) return;
        setPrefs((prev) =>
          prev.map((item) => ({
            ...item,
            enabled: flags[item.id] ?? item.enabled,
          })),
        );
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load notification preferences.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: NotificationPreferenceId, enabled: boolean) {
    const previous = prefs;
    const next = prefs.map((item) =>
      item.id === id ? { ...item, enabled } : item,
    );
    setPrefs(next);
    setSavingId(id);

    const body = Object.fromEntries(next.map((item) => [item.id, item.enabled]));
    void bffCall("updateNotificationSettings", { body })
      .then(() => {
        toast.success(
          enabled
            ? "Notification preference enabled."
            : "Notification preference disabled.",
        );
      })
      .catch((err) => {
        setPrefs(previous);
        toast.error(
          err instanceof BffRequestError
            ? err.message
            : "Could not update notification preference.",
        );
      })
      .finally(() => setSavingId(null));
  }

  if (loading) {
    return <NotificationsFormSkeleton />;
  }

  return (
    <div className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-lg font-bold text-aurora-ink">
        Notification Preferences
      </h2>

      <ul className="mt-5 divide-y divide-[#ececec]">
        {prefs.map((pref) => (
          <li
            key={pref.id}
            className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-aurora-ink">
                {pref.title}
              </p>
              <p className="mt-0.5 text-xs text-[#8a8a8a]">{pref.description}</p>
            </div>
            <Toggle
              checked={pref.enabled}
              disabled={savingId === pref.id}
              label={pref.title}
              onChange={(next) => toggle(pref.id, next)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
