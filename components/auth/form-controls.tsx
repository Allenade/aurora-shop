import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  label: ReactNode;
  htmlFor: string;
  children: ReactNode;
  className?: string;
  error?: string;
};

export function Field({ label, htmlFor, children, className, error }: FieldProps) {
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#2a2a2a]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export function TextInput({ className, invalid, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-[#d9d9d9] bg-white px-3.5 text-sm text-aurora-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#b0b0b0]",
        "focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35",
        invalid && "border-red-500 focus:border-red-500 focus:ring-red-200",
        className,
      )}
      {...props}
    />
  );
}

type SelectInputProps = SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
  placeholder?: string;
};

export function SelectInput({
  className,
  invalid,
  placeholder,
  children,
  value,
  ...props
}: SelectInputProps) {
  const empty = !value;
  return (
    <div className="relative">
      <select
        value={value}
        className={cn(
          "h-11 w-full appearance-none rounded-md border border-[#d9d9d9] bg-white px-3.5 pr-9 text-sm outline-none transition-[border-color,box-shadow]",
          "focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35",
          empty ? "text-[#b0b0b0]" : "text-aurora-ink",
          invalid && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className,
        )}
        {...props}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>
      <span
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#8a8a8a]"
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 4.5 6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </div>
  );
}

type AuthButtonProps = {
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "lime" | "outline" | "ghost";
  className?: string;
};

export function AuthButton({
  children,
  type = "button",
  onClick,
  disabled,
  variant = "primary",
  className,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-12 w-full items-center justify-center rounded-md text-[15px] font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[#1f1f1f] text-aurora-lime hover:opacity-90",
        variant === "lime" && "bg-aurora-lime text-aurora-ink hover:opacity-90",
        variant === "outline" &&
          "border border-[#d9d9d9] bg-white px-6 text-aurora-ink hover:bg-[#f7f7f7]",
        variant === "ghost" &&
          "bg-transparent text-[#8a8a8a] hover:text-aurora-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 3l18 18M10.5 10.6a2.5 2.5 0 0 0 3.5 3.5M9.9 5.2A10.5 10.5 0 0 1 12 5c5.2 0 9.2 3.5 10.5 7-.4 1.1-1.1 2.3-2.1 3.3M6.1 6.2C4.5 7.4 3.4 9 2.5 12c1.3 3.5 5.3 7 10.5 7 1.3 0 2.5-.2 3.6-.6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12C3.8 8.5 7.8 5 12 5s8.2 3.5 9.5 7c-1.3 3.5-5.3 7-9.5 7s-8.2-3.5-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function BuildingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20V6.5L12 3l8 3.5V20H4Zm4-3h2v-2H8v2Zm0-4h2v-2H8v2Zm0-4h2V7H8v2Zm6 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2V7h-2v2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NigeriaFlag() {
  return (
    <svg
      width="18"
      height="12"
      viewBox="0 0 18 12"
      aria-hidden
      className="shrink-0"
    >
      <rect width="6" height="12" fill="#008751" />
      <rect x="6" width="6" height="12" fill="#ffffff" />
      <rect x="12" width="6" height="12" fill="#008751" />
    </svg>
  );
}
