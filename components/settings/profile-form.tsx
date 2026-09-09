"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import { Field, TextInput } from "@/components/auth/form-controls";
import { Avatar } from "@/components/ui/avatar";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import type { ProfileSettings } from "@/lib/settings";

function initialsFromName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AU";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
}

const EMPTY_PROFILE: ProfileSettings = {
  fullName: "",
  email: "",
  phone: "",
  companyName: "",
  address: "",
  initials: "AU",
  avatarUrl: null,
};

export function ProfileForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProfileSettings>(EMPTY_PROFILE);
  const [loaded, setLoaded] = useState<ProfileSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void bffCall<ProfileSettings>("getProfileSettings")
      .then((profile) => {
        if (cancelled) return;
        const next: ProfileSettings = {
          fullName: profile.fullName ?? "",
          email: profile.email ?? "",
          phone: profile.phone ?? "",
          companyName: profile.companyName ?? "",
          address: profile.address ?? "",
          initials:
            profile.initials?.trim() ||
            initialsFromName(profile.fullName ?? ""),
          avatarUrl: profile.avatarUrl ?? null,
        };
        setForm(next);
        setLoaded(next);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Unable to load profile from the API.",
        );
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof ProfileSettings>(
    key: K,
    value: ProfileSettings[K],
  ) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "fullName" && typeof value === "string") {
        next.initials = initialsFromName(value);
      }
      return next;
    });
    if (savedMessage) setSavedMessage(null);
    if (error && loaded) setError(null);
  }

  function applyAvatar(avatarUrl: string | null) {
    setForm((prev) => ({ ...prev, avatarUrl }));
    setLoaded((prev) => (prev ? { ...prev, avatarUrl } : prev));
    router.refresh();
  }

  async function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      setError("Only JPG, PNG, WebP, or GIF images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image size must be less than 2MB.");
      return;
    }

    setUploadingAvatar(true);
    setError(null);
    setSavedMessage(null);

    try {
      const presigned = await bffCall<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
      }>("getProfileAvatarUploadUrl", {
        body: {
          fileName: file.name,
          contentType: file.type,
          folder: "avatars",
        },
      });

      const uploadRes = await fetch(presigned.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) {
        throw new Error("Failed to upload image to storage.");
      }

      const result = await bffCall<{ ok: boolean; avatarUrl: string | null }>(
        "updateProfileAvatar",
        { body: { avatarUrl: presigned.publicUrl } },
      );
      applyAvatar(result.avatarUrl ?? presigned.publicUrl);
      setSavedMessage("Profile photo updated.");
    } catch (err) {
      setError(
        err instanceof BffRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not update profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    setUploadingAvatar(true);
    setError(null);
    setSavedMessage(null);
    try {
      await bffCall("deleteProfileAvatar");
      applyAvatar(null);
      setSavedMessage("Profile photo removed.");
    } catch (err) {
      setError(
        err instanceof BffRequestError
          ? err.message
          : "Could not remove profile photo.",
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMessage(null);
    setError(null);

    void bffCall("updateProfileSettings", {
      body: {
        fullName: form.fullName,
        phone: form.phone,
        companyName: form.companyName,
        address: form.address,
      },
    })
      .then(() => {
        const next = {
          ...form,
          initials: initialsFromName(form.fullName),
        };
        setForm(next);
        setLoaded(next);
        setSavedMessage("Profile changes saved.");
        router.refresh();
      })
      .catch((err) => {
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Could not save profile.",
        );
      })
      .finally(() => setSaving(false));
  }

  function handleCancel() {
    if (loaded) setForm(loaded);
    setSavedMessage(null);
    setError(null);
  }

  if (loading) {
    return (
      <div className="p-5 sm:p-6 lg:p-8">
        <h2 className="text-lg font-bold text-aurora-ink">Profile Information</h2>
        <p className="mt-4 text-sm text-[#8a8a8a]">Loading profile…</p>
      </div>
    );
  }

  if (!loaded && error) {
    return (
      <div className="p-5 sm:p-6 lg:p-8">
        <h2 className="text-lg font-bold text-aurora-ink">Profile Information</h2>
        <p
          className="mt-4 rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error}
        </p>
      </div>
    );
  }

  const busy = saving || uploadingAvatar;

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8">
      <h2 className="text-lg font-bold text-aurora-ink">Profile Information</h2>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Avatar
          initials={form.initials || initialsFromName(form.fullName)}
          src={form.avatarUrl}
          className="size-[72px] text-xl font-bold"
        />
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(e) => void handleAvatarUpload(e)}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-4 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploadingAvatar ? "Uploading…" : "Change Photo"}
            </button>
            {form.avatarUrl ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleRemoveAvatar()}
                className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-4 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Remove Photo
              </button>
            ) : null}
          </div>
          <p className="mt-1.5 text-xs text-[#8a8a8a]">
            JPG, PNG, WebP or GIF. Max size 2MB
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
              readOnly
              disabled
              placeholder="name@company.com"
              className="cursor-not-allowed bg-[#f7f7f7] text-[#6b7280]"
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

          <Field label="State / Region" htmlFor="address" className="sm:col-span-2">
            <TextInput
              id="address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="e.g. Lagos"
            />
          </Field>
        </div>
      </div>

      {error ? (
        <p
          className="mt-4 rounded-xl border border-[#f0b4b4] bg-[#fff5f5] px-4 py-3 text-sm text-[#d64545]"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {savedMessage ? (
        <p className="mt-4 text-sm font-medium text-[#1f9d57]" role="status">
          {savedMessage}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={busy || !loaded}
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg border border-[#d0d0d0] bg-white px-5 text-sm font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
