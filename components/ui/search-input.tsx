import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <span
        className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#9a9a9a]"
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="m16.2 16.2 3.3 3.3"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <input
        className="h-11 w-full rounded-full border border-[#e5e5e5] bg-[#f7f7f7] pr-4 pl-11 text-sm text-aurora-ink outline-none placeholder:text-[#9a9a9a] focus:border-aurora-ink/30 focus:bg-white"
        {...props}
      />
    </div>
  );
}
