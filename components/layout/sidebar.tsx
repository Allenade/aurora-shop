"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavIcon } from "@/components/layout/nav-icons";
import { NeedHelpCard } from "@/components/layout/need-help-card";
import { useSidebar } from "@/components/layout/sidebar-context";
import { Can } from "@/lib/permissions";
import { APP_NAV } from "@/lib/dashboard";
import { cn } from "@/lib/utils";

function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      {collapsed ? (
        <path
          d="M9 6l6 6-6 6M4 4v16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M15 6l-6 6 6 6M20 4v16"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-[#ececec] bg-white py-4 transition-[width] duration-200 ease-out",
        collapsed ? "w-[76px] px-2.5" : "w-[260px] px-4",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          collapsed ? "flex-col" : "justify-between px-1",
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "inline-flex items-center overflow-hidden",
            collapsed && "justify-center",
          )}
          aria-label="Aurora Stores home"
        >
          {collapsed ? (
            <Image
              src="/images/aurora-logo.svg"
              alt=""
              width={36}
              height={30}
              className="h-8 w-auto"
              priority
            />
          ) : (
            <Image
              src="/images/aurora-stores-logo.png"
              alt="Aurora Stores"
              width={167}
              height={60}
              className="h-10 w-auto"
              priority
            />
          )}
        </Link>

        <button
          type="button"
          onClick={toggle}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#5f5f5f] transition-colors hover:bg-[#f6f6f6] hover:text-aurora-ink"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>
      </div>

      <nav
        className={cn(
          "mt-8 flex flex-1 flex-col gap-1.5",
          collapsed && "items-center",
        )}
        aria-label="Main"
      >
        {APP_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Can key={item.id} action={item.action} resource={item.resource}>
              <Link
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center rounded-xl text-sm font-medium transition-colors",
                  collapsed
                    ? "size-11 justify-center"
                    : "gap-3 px-3.5 py-2.5",
                  active
                    ? "bg-aurora-lime text-aurora-ink"
                    : "text-[#5f5f5f] hover:bg-[#f6f6f6] hover:text-aurora-ink",
                )}
              >
                <NavIcon name={item.icon} />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
            </Can>
          );
        })}
      </nav>

      <div className={cn("mt-auto pt-4", collapsed && "flex justify-center")}>
        {collapsed ? (
          <button
            type="button"
            title="Need Help?"
            className="inline-flex size-11 items-center justify-center rounded-xl bg-[#f3ffc7] text-aurora-ink"
            aria-label="Need Help? Contact support"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M9.6 9.6a2.4 2.4 0 1 1 3.5 2.1c-.7.4-1.1.9-1.1 1.7V14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16.6" r="1" fill="currentColor" />
            </svg>
          </button>
        ) : (
          <NeedHelpCard />
        )}
      </div>
    </aside>
  );
}
