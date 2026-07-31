import type { ReactNode } from "react";

export function PagePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 rounded-2xl border border-dashed border-[#d9d9d9] bg-white px-6 py-16 text-center">
      <h1 className="text-2xl font-bold text-aurora-ink">{title}</h1>
      <p className="text-sm text-[#8a8a8a]">
        {description ?? "This page is ready for its own components and Figma UI."}
      </p>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl">{children}</div>;
}
