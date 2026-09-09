"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TrackOrderResult } from "@/components/track-orders/track-order-result";
import { BffRequestError } from "@/lib/bff/client";
import { bffCall } from "@/lib/bff/generated/client";
import type { TrackedShipment } from "@/lib/track-orders";

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

type LookupState = {
  key: string;
  shipment: TrackedShipment | null;
  error: string | null;
  loading: boolean;
  searched: boolean;
};

function TrackOrderContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q")?.trim() ?? "";

  const [draftQuery, setDraftQuery] = useState(urlQuery);
  const [urlSynced, setUrlSynced] = useState(urlQuery);
  if (urlQuery !== urlSynced) {
    setUrlSynced(urlQuery);
    setDraftQuery(urlQuery);
  }

  const [lookup, setLookup] = useState<LookupState>(() => ({
    key: urlQuery,
    shipment: null,
    error: null,
    loading: Boolean(urlQuery),
    searched: Boolean(urlQuery),
  }));

  useEffect(() => {
    const q = urlQuery.trim();
    if (!q) return;

    let cancelled = false;

    void bffCall<TrackedShipment>("trackOrder", { query: { q } })
      .then((result) => {
        if (cancelled) return;
        setLookup({
          key: q,
          shipment: result,
          error: null,
          loading: false,
          searched: true,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setLookup({
          key: q,
          shipment: null,
          error:
            err instanceof BffRequestError && err.status === 404
              ? "No order found for that tracking or order number."
              : err instanceof BffRequestError
                ? err.message
                : "Unable to look up this shipment.",
          loading: false,
          searched: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [urlQuery]);

  const forKey = lookup.key === urlQuery;
  const shipment = forKey ? lookup.shipment : null;
  const error = forKey
    ? lookup.error
    : urlQuery
      ? null
      : lookup.error;
  const loading = Boolean(urlQuery) && (!forKey || lookup.loading);
  const searched = Boolean(urlQuery) || lookup.searched;

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const q = draftQuery.trim();
    if (!q) {
      setLookup({
        key: "",
        shipment: null,
        error: "Enter a tracking or order number.",
        loading: false,
        searched: true,
      });
      return;
    }
    const next = `${pathname}?q=${encodeURIComponent(q)}`;
    router.replace(next);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Track Order
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Enter your tracking or order number to see order status
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
            value={draftQuery}
            onChange={(e) => {
              setDraftQuery(e.target.value);
              if (error) {
                setLookup((prev) => ({ ...prev, error: null }));
              }
            }}
            placeholder="Enter Tracking Number (eg. TRK-897420)"
            className="h-12 w-full rounded-lg border border-[#d9d9d9] bg-white pr-3.5 pl-11 text-sm text-aurora-ink outline-none transition-[border-color,box-shadow] placeholder:text-[#b0b0b0] focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 shrink-0 items-center justify-center whitespace-nowrap rounded-lg bg-aurora-lime px-5 text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Tracking…" : "Track Order"}
        </button>
      </form>

      {loading ? (
        <p className="mt-4 text-sm text-[#8a8a8a]">Looking up shipment…</p>
      ) : null}

      {error ? (
        <p className="mt-4 text-sm font-medium text-[#d64545]" role="alert">
          {error}
        </p>
      ) : null}

      {shipment && !loading ? (
        <div className="mt-6">
          <TrackOrderResult shipment={shipment} />
          <div className="mt-4">
            <Link
              href={`/orders/${encodeURIComponent(shipment.orderId)}`}
              className="text-sm font-semibold text-[#2f6fed] underline-offset-2 hover:underline"
            >
              View order details
            </Link>
          </div>
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
