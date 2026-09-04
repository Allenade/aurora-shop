"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuroraLogo } from "@/components/auth/aurora-logo";
import {
  AuthButton,
  EyeIcon,
  Field,
  TextInput,
} from "@/components/auth/form-controls";
import { BffRequestError, loginRequest } from "@/lib/bff/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      const result = await loginRequest({
        email: email.trim(),
        password,
        rememberMe,
      });
      const nextPath = searchParams.get("next");
      const target =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : result.redirectTo;
      router.replace(target);
      router.refresh();
    } catch (error) {
      if (error instanceof BffRequestError) {
        if (error.fieldErrors) setErrors(error.fieldErrors);
        setFormError(error.message);
      } else {
        setFormError("Unable to sign in. Try again.");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-full w-full items-start justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-14">
      <div className="flex w-full max-w-xl flex-col">
        <AuroraLogo />

        <div className="auth-rise mt-9 flex flex-col">
          <form onSubmit={onSubmit} className="flex w-full flex-col" noValidate>
            <div>
              <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
                Welcome Back
              </h1>
              <p className="mt-1.5 text-sm text-[#8a8a8a]">
                Sign in to your Regalia account
              </p>
            </div>

            <div className="mt-6 flex w-full flex-col gap-4">
              <Field
                label="Email Address"
                htmlFor="email"
                error={errors.email}
              >
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter Email Address"
                  value={email}
                  invalid={Boolean(errors.email)}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-[#2a2a2a]"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-sm font-medium text-[#8a8a8a] hover:text-aurora-ink"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <TextInput
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter Password"
                    value={password}
                    invalid={Boolean(errors.password)}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8a8a8a] hover:text-aurora-ink"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <label className="flex items-center gap-2.5 text-sm text-[#2a2a2a]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded border-[#d9d9d9] accent-aurora-lime"
                />
                Remember me for 30 days
              </label>

              {formError ? (
                <p className="text-sm text-red-600" role="alert">
                  {formError}
                </p>
              ) : null}
            </div>

            <AuthButton
              type="submit"
              variant="lime"
              className="mt-24 w-full"
              disabled={pending}
            >
              {pending ? "Signing in…" : "Sign In"}
            </AuthButton>

            <p className="mt-5 text-center text-sm text-[#8a8a8a]">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-semibold text-aurora-ink"
              >
                Create one free
              </Link>
            </p>

            <p className="mt-4 text-center text-xs leading-relaxed text-[#8a8a8a]">
              Mock auth: any password (4+ chars). Use an email with{" "}
              <span className="font-medium text-aurora-ink">admin</span> for the
              admin app.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full items-center justify-center text-sm text-[#8a8a8a]">
          Loading…
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
