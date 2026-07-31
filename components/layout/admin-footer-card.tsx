import Link from "next/link";

type AdminFooterCardProps = {
  roleName?: string;
  email?: string;
};

export function AdminFooterCard({
  roleName = "Super Admin",
  email = "admin@regaliaelectrical.ng",
}: AdminFooterCardProps) {
  return (
    <div className="rounded-2xl bg-[#f3ffc7] px-4 py-4">
      <p className="text-sm font-semibold text-aurora-ink">{roleName}</p>
      <p className="mt-1 truncate text-xs leading-relaxed text-[#5c5c5c]">
        {email}
      </p>
      <Link
        href="/auth/signin"
        className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border border-aurora-ink/20 bg-white text-sm font-semibold text-aurora-ink transition-colors hover:bg-white/80"
      >
        Sign Out
      </Link>
    </div>
  );
}
