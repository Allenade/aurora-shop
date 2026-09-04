"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type CopyValueButtonProps = {
  value: string;
  className?: string;
  label?: string;
};

export function CopyValueButton({
  value,
  className,
  label = "Copy",
}: CopyValueButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-[#8a8a8a] transition-colors hover:text-aurora-ink",
        className,
      )}
      aria-label={`Copy ${value}`}
    >
      {copied ? (
        <span className="text-[#1f9d57]">Copied</span>
      ) : (
        <>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <rect
              x="8"
              y="8"
              width="11"
              height="11"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.7"
            />
            <path
              d="M5.5 15.5H5A2 2 0 0 1 3 13.5v-8A2 2 0 0 1 5 3.5h8a2 2 0 0 1 2 2V6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
