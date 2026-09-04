"use client";

import { useState } from "react";
import { NeedAssistanceCard } from "@/components/procurements/need-assistance";
import {
  QuoteRequestForm,
  type QuoteFormState,
} from "@/components/procurements/quote-request-form";
import {
  QuoteSubmitted,
  type SubmittedQuote,
} from "@/components/procurements/quote-submitted";
import { RecentQuotes } from "@/components/procurements/recent-quotes";
import {
  createDraftQuote,
  createQuoteReferenceId,
  RECENT_QUOTES,
  type RecentQuote,
} from "@/lib/procurements";

export function ProcurementPage() {
  const [quotes, setQuotes] = useState<RecentQuote[]>(RECENT_QUOTES);
  const [editingQuote, setEditingQuote] = useState<RecentQuote | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<SubmittedQuote | null>(
    null,
  );
  const [formKey, setFormKey] = useState(0);

  function handleSubmitted(
    form: QuoteFormState,
    currentEditing: RecentQuote | null,
  ) {
    const referenceNumber =
      currentEditing?.status === "Draft"
        ? currentEditing.id
        : createQuoteReferenceId();

    if (currentEditing?.status === "Draft") {
      setQuotes((prev) => prev.filter((q) => q.id !== currentEditing.id));
    }

    setEditingQuote(null);
    setSubmittedQuote({
      ...form,
      referenceNumber,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSaveDraft(
    form: QuoteFormState,
    currentEditing: RecentQuote | null,
  ) {
    const draft = createDraftQuote(
      form,
      currentEditing?.status === "Draft" ? currentEditing : null,
    );

    setQuotes((prev) => {
      const withoutCurrent = prev.filter((q) => q.id !== draft.id);
      return [draft, ...withoutCurrent];
    });
    setEditingQuote(null);
  }

  function handleSubmitAnother() {
    setSubmittedQuote(null);
    setFormKey((k) => k + 1);
  }

  if (submittedQuote) {
    return (
      <div className="mx-auto w-full max-w-6xl py-2">
        <QuoteSubmitted
          quote={submittedQuote}
          onSubmitAnother={handleSubmitAnother}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Procurement
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Request custom quotes for bulk orders and special requirements.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
        <QuoteRequestForm
          key={editingQuote?.id ?? `new-quote-${formKey}`}
          editingQuote={editingQuote}
          onClearEdit={() => setEditingQuote(null)}
          onSubmitted={handleSubmitted}
          onSaveDraft={handleSaveDraft}
        />

        <div className="flex flex-col gap-5">
          <RecentQuotes
            quotes={quotes}
            editingId={editingQuote?.id ?? null}
            onEdit={(quote) => {
              if (quote.status !== "Pending" && quote.status !== "Draft") return;
              setEditingQuote(quote);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
          <NeedAssistanceCard />
        </div>
      </div>
    </div>
  );
}
