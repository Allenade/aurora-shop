"use client";

import Link from "next/link";
import { NavIcon } from "@/components/layout/nav-icons";
import { Card } from "@/components/ui/card";
import { Action, Can, Resource } from "@/lib/permissions";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    id: "browse",
    label: "Browse Components",
    href: "/shop",
    className: "bg-[#2f6fed] text-white",
    action: Action.READ,
    resource: Resource.SHOP,
    icon: "shop" as const,
  },
  {
    id: "track",
    label: "Track Orders",
    href: "/track-orders",
    className: "bg-[#1f9d57] text-white",
    action: Action.READ,
    resource: Resource.TRACK_ORDER,
    icon: "track" as const,
  },
  {
    id: "quotes",
    label: "Request Quotes",
    href: "/procurements",
    className: "bg-[#e67a2e] text-white",
    action: Action.CREATE,
    resource: Resource.QUOTE,
    icon: null,
  },
] as const;

function QuoteIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4.5h7l3.5 3.5V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M14 4.5V8h3.5M9 12.5h6M9 16h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function QuickActions() {
  return (
    <Card className="flex h-full flex-col p-5">
      <h2 className="text-base font-semibold text-aurora-ink">Quick Actions</h2>
      <div className="mt-4 flex flex-1 flex-col gap-3">
        {ACTIONS.map((item) => (
          <Can key={item.id} action={item.action} resource={item.resource}>
            <Link
              href={item.href}
              className={cn(
                "flex min-h-[72px] flex-1 items-center justify-center gap-2.5 rounded-xl text-[15px] font-semibold transition-opacity hover:opacity-90",
                item.className,
              )}
            >
              {item.icon ? (
                <NavIcon name={item.icon} className="size-[22px]" />
              ) : (
                <QuoteIcon />
              )}
              {item.label}
            </Link>
          </Can>
        ))}
      </div>
    </Card>
  );
}
