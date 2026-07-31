import { cn } from "@/lib/utils";

type AvatarProps = {
  initials: string;
  className?: string;
};

export function Avatar({ initials, className }: AvatarProps) {
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
