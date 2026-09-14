import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title?: string;
  description: string;
  className?: string;
};

/** Shown when a list/section finishes loading with no rows. */
export function EmptyState({
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa] px-4 py-8 text-center",
        className,
      )}
      role="status"
    >
      {title ? (
        <p className="text-sm font-semibold text-aurora-ink">{title}</p>
      ) : null}
      <p
        className={cn(
          "text-sm text-[#8a8a8a]",
          title ? "mt-1" : undefined,
        )}
      >
        {description}
      </p>
    </div>
  );
}
