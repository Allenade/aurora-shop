"use client";

import {
  Field,
  NigeriaFlag,
  SelectInput,
  TextInput,
} from "@/components/auth/form-controls";
import { DeliveryMethodPicker } from "@/components/cart/delivery-method-picker";
import {
  NIGERIA_STATES,
  type DeliveryFormState,
  type DeliveryMethodId,
} from "@/lib/cart";
import { cn } from "@/lib/utils";

function requiredLabel(text: string) {
  return (
    <>
      {text} <span className="text-[#d64545]">*</span>
    </>
  );
}

type DeliveryInformationFormProps = {
  form: DeliveryFormState;
  errors: Partial<Record<keyof DeliveryFormState, string>>;
  onChange: <K extends keyof DeliveryFormState>(
    key: K,
    value: DeliveryFormState[K],
  ) => void;
  deliveryId: DeliveryMethodId;
  onDeliveryChange: (id: DeliveryMethodId) => void;
};

export function DeliveryInformationForm({
  form,
  errors,
  onChange,
  deliveryId,
  onDeliveryChange,
}: DeliveryInformationFormProps) {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-aurora-ink">
        Delivery Information
      </h2>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label={requiredLabel("Full Name")}
          htmlFor="fullName"
          error={errors.fullName}
        >
          <TextInput
            id="fullName"
            value={form.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="e.g Emeka Darlington"
            invalid={Boolean(errors.fullName)}
          />
        </Field>

        <Field
          label={requiredLabel("Email Address")}
          htmlFor="email"
          error={errors.email}
        >
          <TextInput
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="e.g emeka@company.com"
            invalid={Boolean(errors.email)}
          />
        </Field>

        <Field
          label={requiredLabel("Phone Number")}
          htmlFor="phone"
          error={errors.phone}
        >
          <div
            className={cn(
              "flex h-11 items-center gap-2 rounded-md border border-[#d9d9d9] bg-white px-3 focus-within:border-aurora-ink focus-within:ring-2 focus-within:ring-aurora-lime/35",
              errors.phone &&
                "border-red-500 focus-within:border-red-500 focus-within:ring-red-200",
            )}
          >
            <NigeriaFlag />
            <span className="text-sm text-[#6b7280]">+234</span>
            <input
              id="phone"
              value={form.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              placeholder="XXX XXX XXXX"
              className="min-w-0 flex-1 bg-transparent text-sm text-aurora-ink outline-none placeholder:text-[#b0b0b0]"
            />
          </div>
        </Field>

        <Field
          label={requiredLabel("City")}
          htmlFor="city"
          error={errors.city}
        >
          <TextInput
            id="city"
            value={form.city}
            onChange={(e) => onChange("city", e.target.value)}
            placeholder="e.g Lagos"
            invalid={Boolean(errors.city)}
          />
        </Field>

        <Field
          label={requiredLabel("Street Address")}
          htmlFor="streetAddress"
          className="sm:col-span-2"
          error={errors.streetAddress}
        >
          <TextInput
            id="streetAddress"
            value={form.streetAddress}
            onChange={(e) => onChange("streetAddress", e.target.value)}
            placeholder="e.g 23, Happy Land Estate, Sangotedo"
            invalid={Boolean(errors.streetAddress)}
          />
        </Field>

        <Field
          label={requiredLabel("State")}
          htmlFor="state"
          error={errors.state}
        >
          <SelectInput
            id="state"
            value={form.state}
            onChange={(e) => onChange("state", e.target.value)}
            placeholder="Select State"
            invalid={Boolean(errors.state)}
          >
            {NIGERIA_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field label="Additional Note (Optional)" htmlFor="note">
          <TextInput
            id="note"
            value={form.note}
            onChange={(e) => onChange("note", e.target.value)}
            placeholder="e.g Deliver to Reception building"
          />
        </Field>
      </div>

      <div className="mt-7 border-t border-[#f0f0f0] pt-6">
        <DeliveryMethodPicker
          value={deliveryId}
          onChange={onDeliveryChange}
        />
      </div>
    </div>
  );
}
