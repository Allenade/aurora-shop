"use client";

import { cn } from "@/lib/utils";

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

type FilterCheckboxGroupProps<T extends string = string> = {
  title: string;
  options: FilterOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  className?: string;
};

/** Reusable multi-select checkbox filter group. */
export function FilterCheckboxGroup<T extends string>({
  title,
  options,
  values,
  onChange,
  className,
}: FilterCheckboxGroupProps<T>) {
  const toggle = (value: T) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <fieldset className={cn("flex flex-col gap-3", className)}>
      <legend className="text-sm font-semibold text-aurora-ink">{title}</legend>
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
    </fieldset>
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
}: FilterPriceRangeProps) {
  const percent =
    max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <fieldset className={cn("flex flex-col gap-3", className)}>
      <legend className="text-sm font-semibold text-aurora-ink">{title}</legend>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="price-range-slider h-1.5 w-full cursor-pointer appearance-none rounded-full"
        style={{
          background: `linear-gradient(to right, var(--aurora-lime) 0%, var(--aurora-lime) ${percent}%, #e5e5e5 ${percent}%, #e5e5e5 100%)`,
        }}
        aria-label={title}
      />
      <div className="flex items-center justify-end text-xs font-medium text-[#8a8a8a]">
        <span>{formatValue(value)}</span>
      </div>
    </fieldset>
  );
}
