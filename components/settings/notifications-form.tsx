"use client";

import { useState } from "react";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  type NotificationPreferenceId,
} from "@/lib/settings";
import { cn } from "@/lib/utils";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
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

  function toggle(id: NotificationPreferenceId, enabled: boolean) {
    setPrefs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled } : item)),
    );
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
              <p className="text-sm font-bold text-aurora-ink">{pref.title}</p>
              <p className="mt-0.5 text-sm text-[#8a8a8a]">{pref.description}</p>
            </div>
            <Toggle
              checked={pref.enabled}
              onChange={(enabled) => toggle(pref.id, enabled)}
              label={`${pref.enabled ? "Disable" : "Enable"} ${pref.title}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
