"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type CopyTrackingButtonProps = {
  trackingNumber: string;
  className?: string;
};

export function CopyTrackingButton({
  trackingNumber,
  className,
}: CopyTrackingButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(trackingNumber);
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
        "inline-flex items-center gap-1.5 text-sm font-semibold text-[#2f6fed] transition-opacity hover:opacity-80",
        className,
      )}
      aria-label={`Copy tracking number ${trackingNumber}`}
    >
      {copied ? (
        "Copied"
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
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
          Copy
        </>
      )}
    </button>
  );
}
