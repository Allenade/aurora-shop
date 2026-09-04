"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Avatar } from "@/components/ui/avatar";
import { usePermission } from "@/lib/permissions";
import { cn } from "@/lib/utils";

function ProfileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M5.5 18.5c1.2-2.8 3.5-4.2 6.5-4.2s5.3 1.4 6.5 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10 4.5H7A2.5 2.5 0 0 0 4.5 7v10A2.5 2.5 0 0 0 7 19.5h3M14 8.5 18.5 12 14 15.5M18 12H9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type UserMenuProps = {
  profileHref?: string;
  className?: string;
};

/** Avatar trigger + dropdown — same idea as Education Hub `UserBubble`. */
export function UserMenu({
  profileHref = "/settings",
  className,
}: UserMenuProps) {
  const { user } = usePermission();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase() || "U"
    : "U";
  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim() || "User"
    : "User";
  const email = user?.email ?? "";

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="rounded-full outline-none ring-offset-2 transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-aurora-ink/20"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Avatar initials={initials} />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label="Account"
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-56 overflow-hidden rounded-xl border border-[#e8e8e8] bg-white py-1 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
        >
          <div className="border-b border-[#f0f0f0] px-3.5 py-3">
            <p className="truncate text-sm font-semibold text-aurora-ink">
              {fullName}
            </p>
            {email ? (
              <p className="mt-0.5 truncate text-xs text-[#8a8a8a]">{email}</p>
            ) : null}
          </div>

          <div className="py-1">
            <Link
              href={profileHref}
              role="menuitem"
              className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-aurora-ink transition-colors hover:bg-[#f6f6f6]"
              onClick={() => setOpen(false)}
            >
              <ProfileIcon />
              My Profile
            </Link>
          </div>

          <div className="border-t border-[#f0f0f0] py-1">
            <SignOutButton
              className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm text-[#d64545] transition-colors hover:bg-[#fff1f1]"
            >
              <LogoutIcon />
              Sign out
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
