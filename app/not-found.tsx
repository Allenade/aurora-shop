import Link from "next/link";
import { AuroraLogo } from "@/components/auth/aurora-logo";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#f6f6f6] px-6 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(200,255,0,0.28), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 100%, rgba(21,21,20,0.04), transparent 50%)",
        }}
      />

      <div className="auth-rise relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <AuroraLogo href="/dashboard" />

        <p className="mt-10 font-display text-[5.5rem] leading-none font-bold tracking-tight text-aurora-ink sm:text-[7rem]">
          404
        </p>

        <h1 className="mt-4 text-[1.5rem] font-bold tracking-tight text-aurora-ink sm:text-[1.75rem]">
          Page not found
        </h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#8a8a8a]">
          The page you&apos;re looking for doesn&apos;t exist or may have been
          moved. Check the URL, or head back to somewhere familiar.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg bg-aurora-lime text-[15px] font-semibold text-aurora-ink transition-opacity hover:opacity-90"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/shop"
            className="inline-flex h-12 flex-1 items-center justify-center rounded-lg border border-[#d0d0d0] bg-white text-[15px] font-semibold text-aurora-ink transition-colors hover:bg-[#f7f7f7]"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
