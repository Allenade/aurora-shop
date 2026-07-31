import { cn } from "@/lib/utils";

export type PasswordRule = {
  id: string;
  label: string;
  test: (password: string) => boolean;
};

export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "Use at least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "number",
    label: "Include number(s)",
    test: (p) => /\d/.test(p),
  },
  {
    id: "special",
    label: "Use special characters",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export function passwordMeetsAllRules(password: string) {
  return PASSWORD_RULES.every((rule) => rule.test(password));
}

function RuleIcon({ met }: { met: boolean }) {
  if (met) {
    return (
      <span
        className="flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
        aria-hidden
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5.2 4.1 7.2 8 2.8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#d4d4d4] text-white"
      aria-hidden
    >
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
        <path
          d="M2 2 6 6M6 2 2 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function PasswordRules({ password }: { password: string }) {
  return (
    <ul className="mt-2.5 flex flex-col gap-1.5" aria-live="polite">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.id} className="flex items-center gap-2">
            <RuleIcon met={met} />
            <span
              className={cn(
                "text-xs",
                met ? "text-emerald-600" : "text-[#9a9a9a]",
              )}
            >
              {rule.label}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
