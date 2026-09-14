"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
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
import { ProcurementPageSkeleton } from "@/components/ui/skeleton";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { createQuoteReferenceId, type RecentQuote } from "@/lib/procurements";
import { useProcurementSession } from "@/lib/procurement-session-store";

function errorMessage(err: unknown, fallback: string) {
  if (err instanceof BffRequestError) return err.message || fallback;
  return fallback;
}

export function ProcurementPage() {
  const { quotes, loaded, isStale, apply, fail } = useProcurementSession();
  const [editingQuote, setEditingQuote] = useState<RecentQuote | null>(null);
  const [submittedQuote, setSubmittedQuote] = useState<SubmittedQuote | null>(
    null,
  );
  const [formKey, setFormKey] = useState(0);
  const [busy, setBusy] = useState(false);

  function refreshQuotes() {
    void bffCall<RecentQuote[]>("listQuotes")
      .then((rows) => {
        if (Array.isArray(rows)) apply(rows);
      })
      .catch((err) => {
        const message = errorMessage(err, "Unable to load quotes.");
        if (!loaded) {
          fail(message);
          toast.error(message);
        }
      });
  }

  useEffect(() => {
    if (loaded && !isStale()) return;
    refreshQuotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, isStale]);

  async function handleSubmitted(
    form: QuoteFormState,
    currentEditing: RecentQuote | null,
  ) {
    setBusy(true);

    try {
      if (currentEditing?.status === "Pending" && currentEditing.internalId) {
        await bffCall<RecentQuote>("updateQuote", {
          params: { id: currentEditing.internalId },
          body: { ...form },
        });
        setEditingQuote(null);
        setFormKey((k) => k + 1);
        toast.success(`Quote ${currentEditing.id} updated.`);
        refreshQuotes();
        return;
      }

      if (currentEditing?.status === "Draft" && currentEditing.internalId) {
        const updated = await bffCall<RecentQuote>("updateQuote", {
          params: { id: currentEditing.internalId },
          body: { ...form, submit: true },
        });
        setEditingQuote(null);
        setSubmittedQuote({
          ...form,
          referenceNumber: updated?.id ?? currentEditing.id,
        });
        toast.success("Quote request submitted.");
        refreshQuotes();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const referenceNumber = createQuoteReferenceId();
      setEditingQuote(null);
      setSubmittedQuote({ ...form, referenceNumber });
      const created = await bffCall<RecentQuote>("createQuote", {
        body: { ...form, submit: true },
      });
      if (created?.id) {
        setSubmittedQuote({ ...form, referenceNumber: created.id });
      }
      toast.success("Quote request submitted.");
      refreshQuotes();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(errorMessage(err, "Unable to submit quote request."));
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveDraft(
    form: QuoteFormState,
    currentEditing: RecentQuote | null,
  ) {
    setBusy(true);

    const editableId =
      currentEditing?.internalId &&
      (currentEditing.status === "Draft" || currentEditing.status === "Pending")
        ? currentEditing.internalId
        : null;

    try {
      if (editableId) {
        const updated = await bffCall<RecentQuote>("updateQuote", {
          params: { id: editableId },
          body: { ...form, submit: false },
        });
        setEditingQuote(null);
        setFormKey((k) => k + 1);
        toast.success(
          `Draft ${updated?.id ?? currentEditing?.id ?? ""} saved.`,
        );
        refreshQuotes();
        return;
      }

      const created = await bffCall<RecentQuote>("createQuote", {
        body: { ...form, submit: false },
      });
      setEditingQuote(null);
      setFormKey((k) => k + 1);
      toast.success(
        created?.id ? `Draft ${created.id} saved.` : "Draft saved.",
      );
      refreshQuotes();
    } catch (err) {
      toast.error(errorMessage(err, "Unable to save draft."));
      refreshQuotes();
    } finally {
      setBusy(false);
    }
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

  if (!loaded) {
    return <ProcurementPageSkeleton />;
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
          busy={busy}
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
