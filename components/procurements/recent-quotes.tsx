"use client";

import { Badge } from "@/components/ui/badge";
import type { QuoteStatus, RecentQuote } from "@/lib/procurements";
import { cn } from "@/lib/utils";

function statusTone(status: QuoteStatus) {
  if (status === "Approved") return "green" as const;
  if (status === "Pending") return "orange" as const;
  if (status === "Draft") return "gray" as const;
  return "blue" as const;
}

function canEdit(status: QuoteStatus) {
  return status === "Pending" || status === "Draft";
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 16.5 5 19.5l3-.5L19.2 7.8a1.5 1.5 0 0 0 0-2.1L17.3 3.8a1.5 1.5 0 0 0-2.1 0L4.5 14.5v2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 5.5 17.5 9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

type RecentQuotesProps = {
  quotes: RecentQuote[];
  onEdit: (quote: RecentQuote) => void;
  editingId?: string | null;
};

export function RecentQuotes({
  quotes,
  onEdit,
  editingId = null,
}: RecentQuotesProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5">
      <h2 className="text-base font-bold text-aurora-ink">Recent Quotes</h2>

      <ul className="mt-4 flex flex-col gap-3">
        {quotes.map((quote) => {
          const isEditing = editingId === quote.id;
          return (
            <li
              key={quote.id}
              className={cn(
                "rounded-xl border px-3.5 py-3",
                isEditing
                  ? "border-aurora-lime bg-[#fcfff0]"
                  : "border-[#ececec] bg-white",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-aurora-ink">{quote.id}</p>
                  <p className="mt-0.5 truncate text-xs text-[#8a8a8a]">
                    {quote.title}
                  </p>
                </div>
                <Badge
                  tone={statusTone(quote.status)}
                  className="shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold"
                >
                  {quote.status}
                </Badge>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-aurora-ink">
                    {quote.amount}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a8a8a]">{quote.date}</p>
                </div>

                {canEdit(quote.status) ? (
                  <button
                    type="button"
                    onClick={() => onEdit(quote)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#e0e0e0] bg-white px-2.5 text-xs font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
                    aria-label={`Edit quote ${quote.id}`}
                  >
                    <EditIcon />
                    Edit
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
