"use client";

import { useMemo, useState } from "react";
import { AdminUserDetailDrawer } from "@/components/admin/admin-user-detail-drawer";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ADMIN_USERS,
  ADMIN_USERS_TOTAL_COUNT,
  type AdminUser,
  type AdminUserStatus,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

const FILTERS = ["All Users", "Active", "Suspended"] as const;

function statusTone(status: AdminUserStatus) {
  return status === "ACTIVE" ? ("green" as const) : ("red" as const);
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12s-3.5 6.5-9.5 6.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function UserActionIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="10" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4.5 18.5c.8-2.8 2.9-4.2 5.5-4.2s4.7 1.4 5.5 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M16.5 12.5h4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function UserRow({
  user,
  onOpen,
}: {
  user: AdminUser;
  onOpen: (user: AdminUser) => void;
}) {
  return (
    <tr className="border-b border-[#ececec] last:border-b-0">
      <td className="py-4 pr-4">
        <button
          type="button"
          onClick={() => onOpen(user)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          <Avatar initials={user.initials} className="size-10 shrink-0" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-aurora-lime hover:underline">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-[#9a9a9a]">
              {user.email}
            </p>
          </div>
        </button>
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {user.orders}
      </td>
      <td className="px-3 py-4 text-sm font-medium whitespace-nowrap text-aurora-ink">
        {user.totalSpent}
      </td>
      <td className="px-3 py-4 text-sm whitespace-nowrap text-[#6b7280]">
        {user.joined}
      </td>
      <td className="px-3 py-4">
        <Badge tone={statusTone(user.status)}>{user.status}</Badge>
      </td>
      <td className="py-4 pl-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onOpen(user)}
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`View ${user.name}`}
          >
            <EyeIcon />
          </button>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
            aria-label={`Manage ${user.name}`}
          >
            <UserActionIcon />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState(ADMIN_USERS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All Users");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q);

      const matchesFilter =
        filter === "All Users" ||
        (filter === "Active" && user.status === "ACTIVE") ||
        (filter === "Suspended" && user.status === "Suspended");

      return matchesQuery && matchesFilter;
    });
  }, [users, query, filter]);

  const selectedUser =
    selectedId === null
      ? null
      : (users.find((user) => user.id === selectedId) ?? null);

  function handleStatusChange(status: AdminUserStatus) {
    if (!selectedId) return;
    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedId ? { ...user, status } : user,
      ),
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Users Management
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          {ADMIN_USERS_TOTAL_COUNT} Registered users
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9a9a9a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M16.5 16.5 20 20"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or email"
            className="h-11 w-full rounded-xl border border-[#e5e5e5] bg-white pr-4 pl-10 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30"
          />
        </div>

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as (typeof FILTERS)[number])
          }
          className="h-11 rounded-xl border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-aurora-ink outline-none focus:border-aurora-ink/30"
        >
          {FILTERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="overflow-x-auto px-5 sm:px-6">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead>
              <tr className="border-b border-[#ececec]">
                {[
                  "User",
                  "Orders",
                  "Total Spent",
                  "Joined",
                  "Status",
                  "Actions",
                ].map((label) => (
                  <th
                    key={label}
                    className="py-3.5 text-xs font-semibold tracking-wide text-[#9a9a9a] uppercase first:pr-4 last:pl-3 not-first:px-3"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-[#8a8a8a]"
                  >
                    No users match this search.
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onOpen={(next) => setSelectedId(next.id)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#ececec] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-[#8a8a8a]">
            Showing 1-{filtered.length} of {ADMIN_USERS_TOTAL_COUNT} users
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className="h-9 rounded-lg border border-[#e0e0e0] px-3 text-sm font-medium text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-sm font-semibold",
                  page === 1
                    ? "bg-aurora-lime text-aurora-ink"
                    : "border border-[#e0e0e0] text-[#6b7280] hover:bg-[#f7f7f7]",
                )}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-[#9a9a9a]">…</span>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e0e0e0] text-sm font-semibold text-[#6b7280] hover:bg-[#f7f7f7]"
            >
              11
            </button>
            <button
              type="button"
              className="h-9 rounded-lg bg-aurora-lime px-3 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {selectedUser ? (
        <AdminUserDetailDrawer
          user={selectedUser}
          onClose={() => setSelectedId(null)}
          onStatusChange={handleStatusChange}
        />
      ) : null}
    </div>
  );
}
