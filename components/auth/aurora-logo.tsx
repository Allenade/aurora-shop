import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type AuroraLogoProps = {
  className?: string;
  href?: string;
};

/** Full Aurora Stores wordmark — icon, divider, and stacked text. */
export function AuroraLogo({ className, href = "/" }: AuroraLogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex", className)}
      aria-label="Aurora Stores home"
    >
      <Image
        src="/images/aurora-stores-logo.png"
        alt="Aurora Stores"
        width={167}
        height={60}
        className="h-10 w-auto sm:h-[52px]"
        priority
      />
    </Link>
  );
}
