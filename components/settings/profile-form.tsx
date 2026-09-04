"use client";

import { useState } from "react";
import { Field, TextInput } from "@/components/auth/form-controls";
import { Avatar } from "@/components/ui/avatar";
import {
  DEFAULT_PROFILE,
  type ProfileSettings,
} from "@/lib/settings";

export function ProfileForm() {
  const [form, setForm] = useState<ProfileSettings>(DEFAULT_PROFILE);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function update<K extends keyof ProfileSettings>(
    key: K,
    value: ProfileSettings[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (savedMessage) setSavedMessage(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavedMessage("Profile changes saved.");
  }

  function handleCancel() {
    setForm(DEFAULT_PROFILE);
    setSavedMessage(null);
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-lg font-bold text-aurora-ink">Profile Information</h2>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Avatar
          initials={form.initials}
          className="size-[72px] text-xl font-bold"
        />
        <div>
          <button
            type="button"
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            Change Photo
          </button>
          <p className="mt-1.5 text-xs text-[#8a8a8a]">
            JPG, PNG or GIF. Max size 2MB
          </p>
        </div>
      </div>

      <div className="mt-6 border-t border-[#e8e8e8] pt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="fullName">
            <TextInput
              id="fullName"
              value={form.fullName}
              onChange={(e) => update("fullName", e.target.value)}
              placeholder="Enter full name"
            />
          </Field>

          <Field label="Email Address" htmlFor="email">
            <TextInput
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="name@company.com"
            />
          </Field>

          <Field label="Phone Number" htmlFor="phone">
            <TextInput
              id="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+234 800 000 0000"
            />
          </Field>

          <Field label="Company Name" htmlFor="companyName">
            <TextInput
              id="companyName"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Enter company name"
            />
          </Field>

          <Field label="Address" htmlFor="address" className="sm:col-span-2">
            <TextInput
              id="address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Enter address"
            />
          </Field>
        </div>
      </div>

      {savedMessage ? (
        <p className="mt-4 text-sm font-medium text-[#1f9d57]" role="status">
          {savedMessage}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
