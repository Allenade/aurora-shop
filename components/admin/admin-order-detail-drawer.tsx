"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  buildAdminOrderTimeline,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/lib/admin";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: AdminOrderStatus[] = [
  "Pending",
  "In Transit",
  "Delivered",
];

function statusTone(status: AdminOrderStatus) {
  if (status === "In Transit") return "blue" as const;
  if (status === "Delivered") return "green" as const;
  return "orange" as const;
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M2.5 6.2 4.8 8.5 9.5 3.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <p className="text-sm text-[#8a8a8a]">{label}</p>
      <p className="text-sm font-semibold text-aurora-ink">{value}</p>
    </div>
  );
}

type AdminOrderDetailDrawerProps = {
  order: AdminOrder;
  onClose: () => void;
  onStatusChange: (status: AdminOrderStatus) => void;
};

export function AdminOrderDetailDrawer({
  order,
  onClose,
  onStatusChange,
}: AdminOrderDetailDrawerProps) {
  const [entered, setEntered] = useState(false);
  const timeline = useMemo(
    () => buildAdminOrderTimeline(order.status),
    [order.status],
  );

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => setEntered(true));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        aria-label="Close order details"
        className={cn(
          "absolute inset-0 bg-[#111111]/25 transition-opacity duration-300",
          entered ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-order-detail-title"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out",
          entered ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex-1 overflow-y-auto px-5 pt-6 pb-4 sm:px-6 sm:pt-7">
          <div className="min-w-0">
            <h2
              id="admin-order-detail-title"
              className="text-xl font-bold tracking-tight text-aurora-ink sm:text-[1.35rem]"
            >
              {order.id.replace(/\s+/g, "")}
            </h2>
            <p className="mt-1 text-sm text-[#8a8a8a]">{order.date}</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <Badge tone={statusTone(order.status)}>{order.status}</Badge>
            <select
              value={order.status}
              onChange={(e) =>
                onStatusChange(e.target.value as AdminOrderStatus)
              }
              className="h-9 min-w-[140px] rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm font-medium text-aurora-ink outline-none focus:border-aurora-ink/30"
              aria-label="Update order status"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-[#ececec] bg-[#f7f7f7] px-3.5 py-3">
            <Avatar initials={order.initials} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-aurora-ink">
                {order.customer}
              </p>
              <p className="mt-0.5 truncate text-xs text-[#8a8a8a]">
                {order.email}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-aurora-ink">Order Summary</h3>
            <div className="mt-1 divide-y divide-[#f0f0f0]">
              <SummaryRow
                label="Items"
                value={`${order.items} item${order.items === 1 ? "" : "s"}`}
              />
              <SummaryRow label="Payment Method" value={order.payment} />
              <SummaryRow label="Total" value={order.total} />
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-bold text-aurora-ink">Order Timeline</h3>
            <ol className="mt-4 space-y-0">
              {timeline.map((step, index) => {
                const isLast = index === timeline.length - 1;
                const done = step.status === "done";
                const current = step.status === "current";
                const active = done || current;

                return (
                  <li
                    key={step.id}
                    className="relative flex gap-3.5 pb-5 last:pb-0"
                  >
                    {!isLast ? (
                      <span
                        className={cn(
                          "absolute top-7 left-[11px] h-[calc(100%-1.25rem)] w-0.5",
                          done ? "bg-[#22c55e]" : "bg-[#e5e5e5]",
                        )}
                        aria-hidden
                      />
                    ) : null}

                    <span
                      className={cn(
                        "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                        done && "bg-[#22c55e]",
                        current && "border-2 border-[#22c55e] bg-white",
                        !active && "border-2 border-[#d4d4d4] bg-white",
                      )}
                    >
                      {done ? <CheckIcon /> : null}
                      {current ? (
                        <span className="size-2 rounded-full bg-[#22c55e]" />
                      ) : null}
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          active ? "text-aurora-ink" : "text-[#9a9a9a]",
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="mt-0.5 text-xs text-[#9a9a9a]">{step.at}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 border-t border-[#ececec] bg-white px-5 py-4 sm:flex-row sm:px-6">
          <Button variant="outline" className="flex-1" type="button">
            Download Invoice
          </Button>
          <Button variant="lime" className="flex-1" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
