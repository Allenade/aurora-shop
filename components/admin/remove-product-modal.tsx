"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { CatalogProduct } from "@/lib/admin";
import { cn } from "@/lib/utils";

function TrashGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5.5 7.5h13M9.5 7.5V5.8A1.3 1.3 0 0 1 10.8 4.5h2.4a1.3 1.3 0 0 1 1.3 1.3V7.5M8 7.5l.7 11a1.4 1.4 0 0 0 1.4 1.3h4.8a1.4 1.4 0 0 0 1.4-1.3l.7-11"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type RemoveProductModalProps = {
  product: CatalogProduct;
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveProductModal({
  product,
  onClose,
  onConfirm,
}: RemoveProductModalProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => setEntered(true));

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Close remove product dialog"
        className={cn(
          "absolute inset-0 bg-[#111111]/35 transition-opacity duration-300",
          entered ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-product-title"
        className={cn(
          "relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white px-6 py-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)] transition-all duration-300 sm:px-8",
          entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        )}
      >
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#FFF4CC] text-aurora-ink">
            <TrashGlyph />
          </span>

          <h2
            id="remove-product-title"
            className="mt-5 text-xl font-bold tracking-tight text-aurora-ink"
          >
            Remove Product?
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6b7280]">
            This will remove{" "}
            <span className="font-semibold text-aurora-ink">{product.name}</span>{" "}
            from the catalog. This action cannot be undone.
          </p>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-[#FF0000] bg-white px-4 text-sm font-semibold text-[#FF0000] transition-colors hover:bg-[#fff1f1]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-[#FF0000] px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Remove Product
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
