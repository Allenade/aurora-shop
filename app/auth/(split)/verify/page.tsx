"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { AuroraLogo } from "@/components/auth/aurora-logo";
import { AuthButton } from "@/components/auth/form-controls";
import { loginRequest } from "@/lib/bff/client";

const OTP_LENGTH = 6;

function EnvelopeIcon() {
  return (
    <span className="flex size-11 items-center justify-center rounded-lg bg-aurora-lime">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 7.5h16v10H4v-10Zm0 0 8 5.5 8-5.5"
          stroke="#151514"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const setDigit = (index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });
    if (char && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH)
      .fill("")
      .map((_, i) => pasted[i] ?? "");
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (digits.join("").length !== OTP_LENGTH) {
      setError("Enter the 6-digit verification code");
      return;
    }
    setError("");
    try {
      // Mock BFF: establish httpOnly session after OTP (any 4+ char password works).
      await loginRequest({
        email,
        password: "mock-verified",
        rememberMe: true,
      });
      router.push(`/auth/success?email=${encodeURIComponent(email)}`);
      router.refresh();
    } catch {
      setError("Could not complete verification. Try again.");
    }
  };

  return (
    <div className="flex min-h-full w-full items-start justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-14">
      <div className="flex w-full max-w-[28rem] flex-col">
        <AuroraLogo />

        <form
          onSubmit={onVerify}
          className="auth-rise mt-10 flex flex-col gap-6"
          noValidate
        >
          <EnvelopeIcon />

          <div>
            <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-aurora-ink">
              Check your email
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#8a8a8a]">
              We sent a 6-digit verification code to{" "}
              <span className="font-medium text-aurora-ink">{email}</span>.
              Enter it below to continue.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength={1}
                  value={digits[index]}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(e) => setDigit(index, e.target.value)}
                  onKeyDown={(e) => onKeyDown(index, e)}
                  onPaste={onPaste}
                  className={`size-11 shrink-0 rounded-md border text-center text-lg font-semibold outline-none sm:size-12 ${
                    digits[index]
                      ? "border-aurora-lime bg-aurora-lime text-aurora-ink"
                      : "border-[#d9d9d9] bg-white text-aurora-ink"
                  } focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35`}
                />
              ))}
              <span className="px-0.5 text-lg font-medium text-[#b0b0b0]" aria-hidden>
                -
              </span>
              {[3, 4, 5].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputsRef.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={1}
                  value={digits[index]}
                  aria-label={`Digit ${index + 1}`}
                  onChange={(e) => setDigit(index, e.target.value)}
                  onKeyDown={(e) => onKeyDown(index, e)}
                  onPaste={onPaste}
                  className={`size-11 shrink-0 rounded-md border text-center text-lg font-semibold outline-none sm:size-12 ${
                    digits[index]
                      ? "border-aurora-lime bg-aurora-lime text-aurora-ink"
                      : "border-[#d9d9d9] bg-white text-aurora-ink"
                  } focus:border-aurora-ink focus:ring-2 focus:ring-aurora-lime/35`}
                />
              ))}
            </div>
            {error ? (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <div className="flex gap-3">
            <AuthButton
              variant="outline"
              onClick={() => router.push("/auth/signup")}
            >
              Back to Sign Up
            </AuthButton>
            <AuthButton type="submit" variant="lime" className="flex-1">
              Verify & Continue
            </AuthButton>
          </div>

          <p className="text-center text-sm text-[#8a8a8a]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              className="font-semibold text-aurora-ink underline-offset-2 hover:underline"
            >
              Resend Code
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center p-8 text-sm text-[#8a8a8a]">
          Loading…
        </div>
      }
    >
      <VerifyForm />
    </Suspense>
  );
}
