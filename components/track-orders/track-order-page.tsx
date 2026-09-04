"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { TrackOrderResult } from "@/components/track-orders/track-order-result";
import {
  findShipmentByTracking,
  type TrackedShipment,
} from "@/lib/track-orders";

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle
        cx="11"
        cy="11"
        r="6.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="m16 16 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q")?.trim() ?? "";
  const initialShipment = initialQuery
    ? findShipmentByTracking(initialQuery)
    : null;

  const [query, setQuery] = useState(initialQuery);
  const [shipment, setShipment] = useState<TrackedShipment | null>(
    initialShipment,
  );
  const [error, setError] = useState<string | null>(() =>
    initialQuery && !initialShipment
      ? "No order found for that tracking number. Try TRK-897420."
      : null,
  );
  const [searched, setSearched] = useState(Boolean(initialQuery));

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const result = findShipmentByTracking(query);
    setSearched(true);
    setShipment(result);
    setError(
      result
        ? null
        : "No order found for that tracking number. Try TRK-897420.",
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Track Order
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Enter your tracking number to see order status
        </p>
      </div>

      <form
        onSubmit={handleTrack}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Tracking number</span>
          <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#8a8a8a]">
            <SearchIcon />
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError(null);
            }}
            placeholder="Enter Tracking Number (eg. TRK-897420)"
            className="h-12 w-full rounded-lg border border-[#d9d9d9] bg-white pr-3.5 pl-11 text-sm text-aurora-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#b0b0b0] focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35"
          />
        </label>
        <button
          type="submit"
          className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
        >
          Track Order
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-sm font-medium text-[#d64545]" role="alert">
          {error}
        </p>
      ) : null}

      {shipment ? (
        <div className="mt-6">
          <TrackOrderResult shipment={shipment} />
        </div>
      ) : null}

      {!searched && !shipment ? (
        <p className="mt-8 text-center text-sm text-[#8a8a8a]">
          Enter a tracking number above to view shipment progress.
        </p>
      ) : null}
    </div>
  );
}

export function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-3xl py-10 text-sm text-[#8a8a8a]">
          Loading…
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
