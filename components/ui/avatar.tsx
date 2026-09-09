import { cn } from "@/lib/utils";

type AvatarProps = {
  initials: string;
  src?: string | null;
  className?: string;
};

export function Avatar({ initials, src, className }: AvatarProps) {
  if (src) {
    return (
      <span
        className={cn(
          "inline-flex size-10 items-center justify-center overflow-hidden rounded-full bg-aurora-lime text-sm font-bold text-aurora-ink",
          className,
        )}
        aria-hidden
      >
        {/* Remote/user-uploaded avatar URLs (R2) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="size-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-aurora-lime text-sm font-bold text-aurora-ink",
        className,
      )}
      aria-hidden
    >
      {initials}
    </span>
  );
}
