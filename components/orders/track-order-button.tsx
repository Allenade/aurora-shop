"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type TrackOrderButtonProps = {
  trackingNumber: string;
  className?: string;
};

export function TrackOrderButton({
  trackingNumber,
  className,
}: TrackOrderButtonProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      aria-busy={pending}
      onClick={() =>
        startTransition(() => {
          router.push(`/track-orders?q=${encodeURIComponent(trackingNumber)}`);
        })
      }
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold text-aurora-ink disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
    >
      {pending ? (
        <>
          <LoadingSpinner className="size-4" />
          <span>Tracking…</span>
        </>
      ) : (
        "Track Order"
      )}
    </button>
  );
}
