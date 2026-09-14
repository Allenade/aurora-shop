"use client";

import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";

export type FilterOption<T extends string = string> = {
  value: T;
  label: string;
};

type FiltersProps<T extends string = string> = {
  value: T;
  options: FilterOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  variant?: "tabs" | "pills";
};

/**
 * Reusable filter tabs/pills — call anywhere.
 */
export function Filters<T extends string>({
  value,
  options,
  onChange,
  className,
  variant = "tabs",
}: FiltersProps<T>) {
  if (variant === "pills") {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-2", className)}
        role="group"
        aria-label="Filters"
      >
        {options.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-aurora-lime text-aurora-ink"
                  : "bg-[#f3f3f3] text-[#6b7280] hover:bg-[#ebebeb] hover:text-aurora-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-1 rounded-xl border border-[#e8e8e8] bg-[#f7f7f7] p-1",
        className,
      )}
      role="tablist"
      aria-label="Filters"
    >
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-aurora-ink shadow-sm"
                : "text-[#6b7280] hover:text-aurora-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      className={cn(
        "shrink-0 text-[#8a8a8a] transition-transform duration-200",
        open && "rotate-180",
      )}
    >
      <path
        d="M4 6.5 8 10.5 12 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type FilterSectionProps = {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  count?: number;
};

/** Collapsible filter section header + body. */
export function FilterSection({
  title,
  open,
  onToggle,
  children,
  className,
  count,
}: FilterSectionProps) {
  const panelId = `filter-section-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className="inline-flex min-w-0 items-center gap-2 text-sm font-semibold text-aurora-ink">
          {title}
          {typeof count === "number" && count > 0 ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-aurora-lime px-1.5 text-[10px] font-bold text-aurora-ink">
              {count}
            </span>
          ) : null}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open ? (
        <div id={panelId} className="mt-3">
          {children}
        </div>
      ) : null}
    </div>
  );
}

type FilterCheckboxGroupProps<T extends string = string> = {
  title: string;
  options: FilterOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  className?: string;
  /** When false, section stays open with a static title. Default true. */
  collapsible?: boolean;
  defaultOpen?: boolean;
};

/** Reusable multi-select checkbox filter group. */
export function FilterCheckboxGroup<T extends string>({
  title,
  options,
  values,
  onChange,
  className,
  collapsible = true,
  defaultOpen = true,
}: FilterCheckboxGroupProps<T>) {
  const [open, setOpen] = useState(defaultOpen);

  const toggle = (value: T) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  const body = (
    <div className="flex flex-col gap-2.5">
      {options.map((option) => {
        const checked = values.includes(option.value);
        return (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-[#3a3a3a]"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(option.value)}
              className="size-4 rounded border-[#d0d0d0] accent-aurora-lime"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );

  if (!collapsible) {
    return (
      <fieldset className={cn("flex flex-col gap-3", className)}>
        <legend className="text-sm font-semibold text-aurora-ink">{title}</legend>
        {body}
      </fieldset>
    );
  }

  return (
    <FilterSection
      title={title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
      className={className}
      count={values.length}
    >
      {body}
    </FilterSection>
  );
}

type FilterPriceRangeProps = {
  title?: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

/** Reusable price range slider with lime fill track. */
export function FilterPriceRange({
  title = "Price",
  min,
  max,
  value,
  onChange,
  formatValue = (v) => `₦${v.toLocaleString("en-NG")}`,
  className,
  collapsible = true,
  defaultOpen = true,
}: FilterPriceRangeProps) {
  const [open, setOpen] = useState(defaultOpen);
  const percent =
    max === min
      ? 0
      : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const body = (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="price-range-slider h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--aurora-lime) 0%, var(--aurora-lime) ${percent}%, #e5e5e5 ${percent}%, #e5e5e5 100%)`,
        }}
        aria-label={title}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="mt-3 flex items-center justify-end text-xs font-medium text-[#8a8a8a]">
        <span>{formatValue(value)}</span>
      </div>
    </>
  );

  if (!collapsible) {
    return (
      <fieldset className={cn("flex flex-col gap-3", className)}>
        <legend className="text-sm font-semibold text-aurora-ink">{title}</legend>
        {body}
      </fieldset>
    );
  }

  return (
    <FilterSection
      title={title}
      open={open}
      onToggle={() => setOpen((prev) => !prev)}
      className={className}
    >
      {body}
    </FilterSection>
  );
}
