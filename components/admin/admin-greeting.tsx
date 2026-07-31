import { ADMIN_GREETING } from "@/lib/admin";

export function AdminGreeting() {
  return (
    <div>
      <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
        {ADMIN_GREETING.title}
      </h1>
      <p className="mt-1 text-sm text-[#8a8a8a]">{ADMIN_GREETING.date}</p>
    </div>
  );
}
