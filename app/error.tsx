"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuroraLogo } from "@/components/auth/aurora-logo";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#f6f6f6] px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,255,0,0.22), transparent 55%), radial-gradient(ellipse 60% 40% at 0% 100%, rgba(214,69,69,0.06), transparent 50%)",
        }}
      />

      <div className="auth-rise relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <AuroraLogo href="/dashboard" />

        <span
          className="mt-10 flex size-14 items-center justify-center rounded-full bg-[#fff1f1] text-[#d64545]"
          aria-hidden
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v5.5M12 16.5h.01M10.2 4.8 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.8 4.8a2 2 0 0 0-3.6 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h1 className="mt-5 text-[1.5rem] font-bold tracking-tight text-aurora-ink sm:text-[1.75rem]">
          Something went wrong
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8a8a8a]">
          We hit an unexpected error. Try again, or return to the dashboard
          while we sort it out.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-aurora-lime text-[15px] font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/dashboard"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-[#d0d0d0] bg-white text-[15px] font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
