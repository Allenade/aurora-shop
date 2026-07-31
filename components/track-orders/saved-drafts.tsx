"use client";

import { useState } from "react";
import { DraftRow } from "@/components/track-orders/draft-row";
import { QUOTE_DRAFTS, type QuoteDraft } from "@/lib/track-orders";

export function SavedDrafts() {
  const [drafts, setDrafts] = useState<QuoteDraft[]>(QUOTE_DRAFTS);

  function handleDelete(id: string) {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  }

  const count = drafts.length;

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
            Saved Drafts
          </h1>
          <p className="mt-1 text-sm text-[#8a8a8a]">
            {count} Draft{count === 1 ? "" : "s"} Saved
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          <span aria-hidden className="text-lg leading-none">
            +
          </span>
          New Quote Request
        </button>
      </div>

      <div className="rounded-2xl border border-[#e5e5e5] bg-white px-5 py-2 sm:px-6">
        {drafts.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#8a8a8a]">
            No saved drafts yet.
          </div>
        ) : (
          drafts.map((draft) => (
            <DraftRow key={draft.id} draft={draft} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
