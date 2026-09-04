"use client";

import { SettingsTabIcon } from "@/components/settings/settings-tab-icon";
import { SETTINGS_TABS, type SettingsTab, type SettingsTabItem } from "@/lib/settings";
import { cn } from "@/lib/utils";

type SettingsNavProps = {
  active: SettingsTab;
  onChange: (tab: SettingsTab) => void;
  tabs?: SettingsTabItem[];
};

export function SettingsNav({
  active,
  onChange,
  tabs = SETTINGS_TABS,
}: SettingsNavProps) {
  return (
    <nav aria-label="Settings sections" className="h-full">
      <ul className="flex gap-1.5 overflow-x-auto p-3 sm:flex-col sm:gap-1.5 sm:overflow-visible sm:p-4">
        {tabs.map((tab) => {
          const isActive = tab.id === active;
          return (
            <li key={tab.id} className="shrink-0 sm:w-full">
              <button
                type="button"
                onClick={() => onChange(tab.id)}
                className={cn(
                  "inline-flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-aurora-lime text-aurora-ink"
                    : "text-[#5f5f5f] hover:bg-[#f6f6f6] hover:text-aurora-ink",
                )}
              >
                <SettingsTabIcon tab={tab.id} />
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
