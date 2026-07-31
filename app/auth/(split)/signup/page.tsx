"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuroraLogo } from "@/components/auth/aurora-logo";
import {
  AuthButton,
  BuildingIcon,
  EyeIcon,
  Field,
  NigeriaFlag,
  SelectInput,
  TextInput,
} from "@/components/auth/form-controls";
import {
  PasswordRules,
  passwordMeetsAllRules,
} from "@/components/auth/password-rules";
import { StepIndicator } from "@/components/auth/step-indicator";
import {
  INDUSTRIES,
  NIGERIA_STATES,
  type SignupStep1,
  type SignupStep2,
} from "@/lib/auth";

const emptyStep1: SignupStep1 = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  countryCode: "+234",
};

const emptyStep2: SignupStep2 = {
  companyName: "",
  industry: "",
  state: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<SignupStep1>(emptyStep1);
  const [step2, setStep2] = useState<SignupStep2>(emptyStep2);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validateStep1 = () => {
    const next: Record<string, string> = {};
    if (!step1.firstName.trim()) next.firstName = "First name is required";
    if (!step1.lastName.trim()) next.lastName = "Last name is required";
    if (!step1.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(step1.email))
      next.email = "Enter a valid email";
    if (!step1.phone.trim()) next.phone = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const validateStep2 = () => {
    const next: Record<string, string> = {};
    if (!step2.companyName.trim())
      next.companyName = "Company name is required";
    if (!step2.industry) next.industry = "Select an industry";
    if (!step2.state) next.state = "Select a state";
    if (!step2.password) next.password = "Password is required";
    else if (!passwordMeetsAllRules(step2.password))
      next.password = "Password does not meet all requirements";
    if (step2.confirmPassword !== step2.password)
      next.confirmPassword = "Passwords do not match";
    if (!step2.agreeToTerms) next.agreeToTerms = "Please accept the terms";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;
    setErrors({});
    setStep(2);
  };

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    router.push(`/auth/verify?email=${encodeURIComponent(step1.email.trim())}`);
  };

  return (
    <div className="flex min-h-full w-full items-start justify-center px-8 py-12 sm:px-12 lg:px-16 lg:py-14">
      <div className="flex w-full max-w-[28rem] flex-col">
        <AuroraLogo />

        <div className="mt-9">
          <StepIndicator current={step} />
        </div>

        <div className="auth-rise mt-9 flex flex-col">
          {step === 1 ? (
            <form
              onSubmit={onContinue}
              className="flex flex-col gap-[18px]"
              noValidate
            >
              <div className="mb-1">
                <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-aurora-ink">
                  Create Your Account
                </h1>
                <p className="mt-2 text-sm text-[#8a8a8a]">
                  Start with your personal details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-3">
                <Field
                  label="First Name"
                  htmlFor="firstName"
                  error={errors.firstName}
                >
                  <TextInput
                    id="firstName"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Adebayo"
                    value={step1.firstName}
                    invalid={Boolean(errors.firstName)}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, firstName: e.target.value }))
                    }
                  />
                </Field>
                <Field
                  label="Last Name"
                  htmlFor="lastName"
                  error={errors.lastName}
                >
                  <TextInput
                    id="lastName"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Okeke"
                    value={step1.lastName}
                    invalid={Boolean(errors.lastName)}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, lastName: e.target.value }))
                    }
                  />
                </Field>
              </div>

              <Field label="Email Address" htmlFor="email" error={errors.email}>
                <TextInput
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="e.g. you@company.com"
                  value={step1.email}
                  invalid={Boolean(errors.email)}
                  onChange={(e) =>
                    setStep1((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </Field>

              <Field label="Phone Number" htmlFor="phone" error={errors.phone}>
                <div
                  className={`flex h-11 overflow-hidden rounded-md border bg-white ${
                    errors.phone ? "border-red-500" : "border-[#d9d9d9]"
                  } focus-within:border-aurora-ink focus-within:ring-2 focus-within:ring-aurora-lime/35`}
                >
                  <label htmlFor="countryCode" className="sr-only">
                    Country code
                  </label>
                  <div className="flex items-center gap-1.5 border-r border-[#d9d9d9] px-2.5">
                    <NigeriaFlag />
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={step1.countryCode}
                      onChange={(e) =>
                        setStep1((s) => ({
                          ...s,
                          countryCode: e.target.value,
                        }))
                      }
                      className="bg-transparent py-2 text-sm text-aurora-ink outline-none"
                    >
                      <option value="+234">+234</option>
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+256">+256</option>
                    </select>
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel-national"
                    placeholder="801 234 5678"
                    value={step1.phone}
                    onChange={(e) =>
                      setStep1((s) => ({ ...s, phone: e.target.value }))
                    }
                    className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm text-aurora-ink outline-none placeholder:text-[#b0b0b0]"
                  />
                </div>
              </Field>

              <AuthButton type="submit" className="mt-3">
                Continue
              </AuthButton>

              <p className="text-center text-sm text-[#8a8a8a]">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-aurora-ink"
                >
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <form
              onSubmit={onCreate}
              className="flex flex-col gap-[18px]"
              noValidate
            >
              <div className="mb-1">
                <h1 className="text-[1.875rem] font-bold leading-tight tracking-tight text-aurora-ink">
                  Almost Done!
                </h1>
                <p className="mt-2 text-sm text-[#8a8a8a]">
                  Tell us about your business
                </p>
              </div>

              <Field
                label="Company/Organization name"
                htmlFor="companyName"
                error={errors.companyName}
              >
                <div className="relative">
                  <TextInput
                    id="companyName"
                    name="companyName"
                    autoComplete="organization"
                    placeholder="e.g TechSolution Nigeria Ltd"
                    value={step2.companyName}
                    invalid={Boolean(errors.companyName)}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, companyName: e.target.value }))
                    }
                    className="pr-10"
                  />
                  <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[#8a8a8a]">
                    <BuildingIcon />
                  </span>
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Industry"
                  htmlFor="industry"
                  error={errors.industry}
                >
                  <SelectInput
                    id="industry"
                    name="industry"
                    value={step2.industry}
                    placeholder="Select Industry"
                    invalid={Boolean(errors.industry)}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, industry: e.target.value }))
                    }
                  >
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="State" htmlFor="state" error={errors.state}>
                  <SelectInput
                    id="state"
                    name="state"
                    value={step2.state}
                    placeholder="Select State"
                    invalid={Boolean(errors.state)}
                    onChange={(e) =>
                      setStep2((s) => ({ ...s, state: e.target.value }))
                    }
                  >
                    {NIGERIA_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              </div>

              <div>
                <Field
                  label="Password"
                  htmlFor="password"
                  error={errors.password}
                >
                  <div className="relative">
                    <TextInput
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Password"
                      value={step2.password}
                      invalid={Boolean(errors.password)}
                      onChange={(e) =>
                        setStep2((s) => ({ ...s, password: e.target.value }))
                      }
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
                </Field>
                <PasswordRules password={step2.password} />
              </div>

              <Field
                label="Confirm Password"
                htmlFor="confirmPassword"
                error={errors.confirmPassword}
              >
                <div className="relative">
                  <TextInput
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat Password"
                    value={step2.confirmPassword}
                    invalid={Boolean(errors.confirmPassword)}
                    onChange={(e) =>
                      setStep2((s) => ({
                        ...s,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#8a8a8a] hover:text-aurora-ink"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                    aria-pressed={showConfirm}
                  >
                    <EyeIcon open={showConfirm} />
                  </button>
                </div>
              </Field>

              <div className="flex flex-col gap-1.5">
                <label className="flex items-start gap-2.5 text-sm text-[#2a2a2a]">
                  <input
                    type="checkbox"
                    checked={step2.agreeToTerms}
                    onChange={(e) =>
                      setStep2((s) => ({
                        ...s,
                        agreeToTerms: e.target.checked,
                      }))
                    }
                    className="mt-0.5 size-4 rounded border-[#d9d9d9] accent-aurora-lime"
                  />
                  <span>
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="font-semibold underline underline-offset-2"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="#"
                      className="font-semibold underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.agreeToTerms ? (
                  <p className="text-sm text-red-600" role="alert">
                    {errors.agreeToTerms}
                  </p>
                ) : null}
              </div>

              <div className="mt-2 flex gap-3">
                <AuthButton
                  variant="outline"
                  onClick={() => {
                    setErrors({});
                    setStep(1);
                  }}
                >
                  Back
                </AuthButton>
                <AuthButton type="submit" variant="lime" className="flex-1">
                  Create Account
                </AuthButton>
              </div>

              <p className="text-center text-sm text-[#8a8a8a]">
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-aurora-ink"
                >
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
