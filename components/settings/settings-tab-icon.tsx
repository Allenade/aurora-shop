import type { SettingsTab } from "@/lib/settings";

export function SettingsTabIcon({
  tab,
  className,
}: {
  tab: SettingsTab;
  className?: string;
}) {
  const props = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    className,
    "aria-hidden": true as const,
  };

  if (tab === "profile") {
    return (
      <svg {...props}>
        <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M5.5 19.2c1.2-3 3.4-4.5 6.5-4.5s5.3 1.5 6.5 4.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (tab === "security") {
    return (
      <svg {...props}>
        <rect
          x="6"
          y="10"
          width="12"
          height="10"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <path
          d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (tab === "notifications") {
    return (
      <svg {...props}>
        <path
          d="M6.5 16.5h11M8 16.5V10a4 4 0 1 1 8 0v6.5M10.5 16.5v1a1.5 1.5 0 0 0 3 0v-1"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg {...props}>
      <rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.5 10h17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
