import type { AdminGreetingData } from "@/lib/admin";

type AdminGreetingProps = {
  greeting?: AdminGreetingData;
};

export function AdminGreeting({ greeting }: AdminGreetingProps) {
  const title = greeting?.title ?? "Welcome back";
  const date = greeting?.date ?? "";

  return (
    <div>
      <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
        {title}
      </h1>
      {date ? <p className="mt-1 text-sm text-[#8a8a8a]">{date}</p> : null}
    </div>
  );
}
