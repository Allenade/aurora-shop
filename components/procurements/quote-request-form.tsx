"use client";

import { useState } from "react";
import {
  Field,
  NigeriaFlag,
  TextInput,
} from "@/components/auth/form-controls";
import type { RecentQuote } from "@/lib/procurements";
import { cn } from "@/lib/utils";

export type QuoteFormState = {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  components: string;
  quantity: string;
  budget: string;
  deliveryDate: string;
  specs: string;
};

const INITIAL: QuoteFormState = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  components: "",
  quantity: "",
  budget: "",
  deliveryDate: "",
  specs: "",
};

function quoteToForm(quote: RecentQuote): QuoteFormState {
  return {
    companyName: quote.companyName,
    contactPerson: quote.contactPerson,
    email: quote.email,
    phone: quote.phone,
    components: quote.components,
    quantity: quote.quantity,
    budget: quote.budget,
    deliveryDate: quote.deliveryDate,
    specs: quote.specs,
  };
}

function requiredLabel(text: string) {
  return (
    <>
      {text} <span className="text-[#d64545]">*</span>
    </>
  );
}

type QuoteRequestFormProps = {
  editingQuote?: RecentQuote | null;
  onClearEdit?: () => void;
  onSubmitted?: (form: QuoteFormState, editingQuote: RecentQuote | null) => void;
  onSaveDraft?: (form: QuoteFormState, editingQuote: RecentQuote | null) => void;
};

export function QuoteRequestForm({
  editingQuote = null,
  onClearEdit,
  onSubmitted,
  onSaveDraft,
}: QuoteRequestFormProps) {
  const [form, setForm] = useState<QuoteFormState>(() =>
    editingQuote ? quoteToForm(editingQuote) : INITIAL,
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuoteFormState, string>>
  >({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function update<K extends keyof QuoteFormState>(
    key: K,
    value: QuoteFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const next: Partial<Record<keyof QuoteFormState, string>> = {};
    if (!form.companyName.trim()) next.companyName = "Company name is required";
    if (!form.contactPerson.trim())
      next.contactPerson = "Contact person is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.components.trim())
      next.components = "Components required is required";
    if (!form.quantity.trim()) next.quantity = "Estimated quantity is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavedMessage(null);
    if (!validate()) return;

    if (editingQuote && editingQuote.status !== "Draft") {
      setSavedMessage(`Quote ${editingQuote.id} updated.`);
      setForm(INITIAL);
      onClearEdit?.();
      return;
    }

    onSubmitted?.(form, editingQuote);
  }

  function handleSaveDraft() {
    setErrors({});
    onSaveDraft?.(form, editingQuote);
    setSavedMessage(
      editingQuote?.status === "Draft"
        ? `Draft ${editingQuote.id} updated.`
        : "Draft saved.",
    );
    setForm(INITIAL);
    onClearEdit?.();
  }

  function onCancelEdit() {
    onClearEdit?.();
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-aurora-ink">
            {editingQuote
            ? editingQuote.status === "Draft"
              ? "Edit Draft"
              : "Edit Quote"
            : "Request A Quote"}
          </h2>
          {editingQuote ? (
            <p className="mt-1 text-xs text-[#8a8a8a]">
              Editing {editingQuote.id}
            </p>
          ) : null}
        </div>
        {editingQuote ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-sm font-semibold text-[#6b7280] hover:text-aurora-ink"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label={requiredLabel("Company Name")}
          htmlFor="companyName"
          error={errors.companyName}
        >
          <TextInput
            id="companyName"
            value={form.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            placeholder="Enter company name"
            invalid={Boolean(errors.companyName)}
          />
        </Field>

        <Field
          label={requiredLabel("Contact Person")}
          htmlFor="contactPerson"
          error={errors.contactPerson}
        >
          <TextInput
            id="contactPerson"
            value={form.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            placeholder="Enter contact person"
            invalid={Boolean(errors.contactPerson)}
          />
        </Field>

        <Field
          label={requiredLabel("Email Address")}
          htmlFor="email"
          error={errors.email}
        >
          <TextInput
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="name@company.com"
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field
          label={requiredLabel("Phone Number")}
          htmlFor="phone"
          error={errors.phone}
        >
          <div
            className={cn(
              "flex h-11 items-center gap-2 rounded-md border border-[#d9d9d9] bg-white px-3 focus-within:border-aurora-ink focus-within:ring-2 focus-within:ring-aurora-lime/35",
              errors.phone &&
                "border-red-500 focus-within:border-red-500 focus-within:ring-red-200",
            )}
          >
            <NigeriaFlag />
            <span className="text-sm text-[#6b7280]">+234</span>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="801 234 5678"
              className="min-w-0 flex-1 bg-transparent text-sm text-aurora-ink outline-none placeholder:text-[#b0b0b0]"
            />
          </div>
        </Field>

        <Field
          label={requiredLabel("Components Required")}
          htmlFor="components"
          className="sm:col-span-2"
          error={errors.components}
        >
          <TextInput
            id="components"
            value={form.components}
            onChange={(e) => update("components", e.target.value)}
            placeholder="e.g. Arduino Uno R3, DHT22, NEMA 17"
            invalid={Boolean(errors.components)}
          />
        </Field>

        <Field
          label={requiredLabel("Estimated Quantity")}
          htmlFor="quantity"
          error={errors.quantity}
        >
          <TextInput
            id="quantity"
            value={form.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            placeholder="e.g. 500 units"
            invalid={Boolean(errors.quantity)}
          />
        </Field>

        <Field label="Budget Range" htmlFor="budget">
          <div className="flex h-11 items-center rounded-md border border-[#d9d9d9] bg-white focus-within:border-aurora-ink focus-within:ring-2 focus-within:ring-aurora-lime/35">
            <span className="pl-3.5 text-sm font-medium text-[#6b7280]">₦</span>
            <input
              id="budget"
              value={form.budget}
              onChange={(e) => update("budget", e.target.value)}
              placeholder="e.g. 250,000"
              className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm text-aurora-ink outline-none placeholder:text-[#b0b0b0]"
            />
          </div>
        </Field>

        <Field
          label="Required Delivery Date"
          htmlFor="deliveryDate"
          className="sm:col-span-2"
        >
          <div className="relative">
            <TextInput
              id="deliveryDate"
              type="date"
              value={form.deliveryDate}
              onChange={(e) => update("deliveryDate", e.target.value)}
              className="pr-10"
            />
            <span
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[#8a8a8a]"
              aria-hidden
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect
                  x="4"
                  y="5"
                  width="16"
                  height="15"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M8 3.5v3M16 3.5v3M4 10h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </div>
        </Field>

        <Field
          label="Technical Specifications & Additional Requirements"
          htmlFor="specs"
          className="sm:col-span-2"
        >
          <textarea
            id="specs"
            value={form.specs}
            onChange={(e) => update("specs", e.target.value)}
            rows={5}
            placeholder="Share any technical specs, brands, or delivery notes..."
            className="w-full resize-y rounded-md border border-[#d9d9d9] bg-white px-3.5 py-3 text-sm text-aurora-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#b0b0b0] focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35"
          />
        </Field>
      </div>

      {savedMessage ? (
        <p className="mt-4 text-sm font-medium text-[#1f9d57]" role="status">
          {savedMessage}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          {editingQuote && editingQuote.status !== "Draft"
            ? "Update Quote"
            : "Submit Quote Request"}
        </button>
        <button
          type="button"
          onClick={handleSaveDraft}
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Save Draft
        </button>
      </div>
    </form>
  );
}
