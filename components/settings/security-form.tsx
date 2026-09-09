"use client";

import { useState } from "react";
import {
  EyeIcon,
  Field,
  TextInput,
} from "@/components/auth/form-controls";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  error?: string;
  visible: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

function PasswordField({
  id,
  label,
  value,
  placeholder,
  error,
  visible,
  disabled,
  onToggle,
  onChange,
}: PasswordFieldProps) {
  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className="relative">
        <TextInput
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          invalid={Boolean(error)}
          disabled={disabled}
          className="pr-11"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className={cn(
            "absolute top-1/2 right-3 -translate-y-1/2 text-[#8a8a8a] transition-colors hover:text-aurora-ink disabled:opacity-50",
          )}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
    </Field>
  );
}

type SecurityFormState = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const INITIAL: SecurityFormState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export function SecurityForm() {
  const [form, setForm] = useState<SecurityFormState>(INITIAL);
  const [visible, setVisible] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Partial<SecurityFormState>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  function update<K extends keyof SecurityFormState>(
    key: K,
    value: SecurityFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (savedMessage) setSavedMessage(null);
    if (error) setError(null);
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  }

  function validate() {
    const next: Partial<SecurityFormState> = {};
    if (!form.currentPassword.trim()) {
      next.currentPassword = "Current password is required";
    }
    if (!form.newPassword.trim()) {
      next.newPassword = "New password is required";
    } else if (form.newPassword.length < 8) {
      next.newPassword = "Use at least 8 characters";
    }
    if (!form.confirmPassword.trim()) {
      next.confirmPassword = "Confirm your new password";
    } else if (form.confirmPassword !== form.newPassword) {
      next.confirmPassword = "Passwords do not match";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavedMessage(null);
    setError(null);
    if (!validate()) return;

    setSaving(true);
    void bffCall("updateSettingsPassword", {
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
    })
      .then(() => {
        setSavedMessage("Password updated successfully.");
        setForm(INITIAL);
        setErrors({});
        setVisible({ current: false, next: false, confirm: false });
      })
      .catch((err) => {
        setError(
          err instanceof BffRequestError
            ? err.message
            : "Could not update password.",
        );
      })
      .finally(() => setSaving(false));
  }

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 lg:p-8" noValidate>
      <h2 className="text-lg font-bold text-aurora-ink">Security Settings</h2>

      <div className="mt-6">
        <h3 className="text-sm font-bold text-aurora-ink">Change Password</h3>

        <div className="mt-4 flex flex-col gap-4">
          <PasswordField
            id="currentPassword"
            label="Current Password"
            value={form.currentPassword}
            placeholder="Enter current password"
            error={errors.currentPassword}
            visible={visible.current}
            disabled={saving}
            onToggle={() =>
              setVisible((prev) => ({ ...prev, current: !prev.current }))
            }
            onChange={(value) => update("currentPassword", value)}
          />

          <PasswordField
            id="newPassword"
            label="New Password"
            value={form.newPassword}
            placeholder="Enter new password"
            error={errors.newPassword}
            visible={visible.next}
            disabled={saving}
            onToggle={() =>
              setVisible((prev) => ({ ...prev, next: !prev.next }))
            }
            onChange={(value) => update("newPassword", value)}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm New Password"
            value={form.confirmPassword}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            visible={visible.confirm}
            disabled={saving}
            onToggle={() =>
              setVisible((prev) => ({ ...prev, confirm: !prev.confirm }))
            }
            onChange={(value) => update("confirmPassword", value)}
          />
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

      <div className="mt-6">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
}
