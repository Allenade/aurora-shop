"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AuroraLogo } from "@/components/auth/aurora-logo";
import { AuthButton } from "@/components/auth/form-controls";

const HIGHLIGHTS = [
  { title: "15k+ Products", icon: "bag" },
  { title: "Fast Delivery", icon: "truck" },
  { title: "Verified Vendor", icon: "shield" },
] as const;

function HighlightIcon({ icon }: { icon: (typeof HIGHLIGHTS)[number]["icon"] }) {
  if (icon === "bag") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 8V6.5A5 5 0 0 1 17 6.5V8M5.5 8h13l.8 11.2a1.5 1.5 0 0 1-1.5 1.6H6.2a1.5 1.5 0 0 1-1.5-1.6L5.5 8Z"
          stroke="#151514"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (icon === "truck") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 16V7.5h10V16M13 10.5h3.6L19.5 13v3H13M7 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Zm9.2 0a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z"
          stroke="#151514"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2 19 6.2v4.4c0 4.5-2.9 8.5-7 10-4.1-1.5-7-5.5-7-10V6.2L12 3.2Z"
        stroke="#151514"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12.1 1.9 1.9 3.8-4"
        stroke="#151514"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your account";

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center bg-white px-6 py-12">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <AuroraLogo />

        <Image
          src="/images/profile-success.png"
          alt=""
          width={220}
          height={220}
          className="mt-8 h-auto w-[200px] sm:w-[220px]"
          priority
        />

        <h1 className="mt-6 text-[1.75rem] font-bold tracking-tight text-aurora-ink sm:text-[1.875rem]">
          Profile Created Successfully!
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8a8a8a]">
          You&apos;re all verified and ready to go. You&apos;re one step closer
          to building that machine.
        </p>

        <div className="mt-8 grid w-full grid-cols-3 gap-3">
          {HIGHLIGHTS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2 rounded-xl border border-[#e8e8e8] px-2 py-4"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-aurora-lime">
                <HighlightIcon icon={item.icon} />
              </span>
              <span className="text-xs font-semibold text-aurora-ink sm:text-sm">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-md border border-[#d9d9d9] bg-white text-[15px] font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-md bg-aurora-lime text-[15px] font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            Browse Products
          </Link>
        </div>

        <p className="mt-6 text-sm text-[#8a8a8a]">
          Signed in as{" "}
          <span className="font-medium text-aurora-ink">{email}</span>
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center text-sm text-[#8a8a8a]">
          Loading…
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
