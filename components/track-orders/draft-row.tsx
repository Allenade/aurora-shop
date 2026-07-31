import { Badge } from "@/components/ui/badge";
import type { QuoteDraft } from "@/lib/track-orders";

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
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

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.5 7.5h13M9.5 7.5V5.8A1.3 1.3 0 0 1 10.8 4.5h2.4a1.3 1.3 0 0 1 1.3 1.3V7.5M8 7.5l.7 11a1.4 1.4 0 0 0 1.4 1.3h4.8a1.4 1.4 0 0 0 1.4-1.3l.7-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MetaColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold tracking-wide text-[#9a9a9a] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-medium text-aurora-ink">
        {value}
      </p>
    </div>
  );
}

export function DraftRow({
  draft,
  onDelete,
}: {
  draft: QuoteDraft;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-[#e8e8e8] py-5 last:border-b-0 lg:flex-row lg:items-center lg:gap-6">
      <div className="min-w-0 lg:w-[240px] lg:shrink-0">
        <p className="text-xs text-[#8a8a8a]">Saved {draft.savedAt}</p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <p className="text-sm font-bold text-aurora-ink">{draft.id}</p>
          <Badge
            tone="orange"
            className="rounded-md border border-[#f0c49a] bg-[#fff7ef] px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
          >
            Draft
          </Badge>
        </div>
      </div>

      <div className="grid min-w-0 flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
        <MetaColumn label="Company Name" value={draft.companyName} />
        <MetaColumn label="Contacts" value={draft.contact} />
        <MetaColumn label="Components" value={draft.components} />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 lg:justify-end">
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#f7f7f7] hover:text-aurora-ink"
          aria-label={`Edit draft ${draft.id}`}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          onClick={() => onDelete(draft.id)}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-[#e0e0e0] text-[#6b7280] transition-colors hover:bg-[#fff1f1] hover:text-[#d64545]"
          aria-label={`Delete draft ${draft.id}`}
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}
