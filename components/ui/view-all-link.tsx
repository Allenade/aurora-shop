import Link from "next/link";
import { cn } from "@/lib/utils";

type ViewAllLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/** Lime text + lime circle arrow — matches Figma “View All Orders”. */
export function ViewAllLink({ href, children, className }: ViewAllLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-3 text-sm font-semibold text-aurora-lime transition-opacity hover:opacity-80",
        className,
      )}
    >
      {children}
      <span
        className="inline-flex size-[22px] shrink-0 items-center justify-center rounded-full bg-aurora-lime"
        aria-hidden
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M2.5 6h7M6.5 3l3 3-3 3"
            stroke="#151514"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
