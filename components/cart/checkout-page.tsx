"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BankTransferPayment } from "@/components/cart/bank-transfer-payment";
import { CardPaymentForm } from "@/components/cart/card-payment-form";
import { CheckoutSteps } from "@/components/cart/checkout-steps";
import { DeliveryInformationForm } from "@/components/cart/delivery-information-form";
import { OrderPlacedSuccess } from "@/components/cart/order-placed-success";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { ReviewPayment } from "@/components/cart/review-payment";
import {
  DELIVERY_METHODS,
  getCartTotals,
  INITIAL_DELIVERY_FORM,
  type DeliveryFormState,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "@/lib/cart";
import { Action, Resource, RequirePermission } from "@/lib/permissions";
import {
  getDefaultProduct,
  getProductBySlug,
  type ShopProduct,
} from "@/lib/shop";
import { bffCall } from "@/lib/bff/generated/client";

function PlaceOrderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m8.2 12.2 2.6 2.6 5.2-5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CartLine = {
  product: ShopProduct;
  qty: number;
};

type CheckoutPhase = "delivery" | "review" | "bank" | "card" | "success";

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const addSlug = searchParams.get("add");

  const initialLines = useMemo<CartLine[]>(() => {
    const added = addSlug ? getProductBySlug(addSlug) : null;
    if (added) return [{ product: added, qty: 1 }];
    return [{ product: getDefaultProduct(), qty: 1 }];
  }, [addSlug]);

  const [phase, setPhase] = useState<CheckoutPhase>("delivery");
  const [lines, setLines] = useState(initialLines);
  const [form, setForm] = useState<DeliveryFormState>(INITIAL_DELIVERY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryFormState, string>>
  >({});
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] = useState<DeliveryMethodId>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("bank");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const [transferReference, setTransferReference] = useState<string | null>(
    null,
  );
  const [bankDetails, setBankDetails] = useState<{
    bank: string;
    accountName: string;
    accountNumber: string;
  } | null>(null);

  const delivery =
    DELIVERY_METHODS.find((m) => m.id === deliveryId) ?? DELIVERY_METHODS[0]!;
  const { total } = getCartTotals(
    lines.map((line) => ({ price: line.product.price, qty: line.qty })),
    delivery.price,
  );
  const step = phase === "delivery" ? 1 : 2;

  function updateForm<K extends keyof DeliveryFormState>(
    key: K,
    value: DeliveryFormState[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  useEffect(() => {
    if (!addSlug) return;
    void bffCall<ShopProduct>("getProductBySlug", { params: { slug: addSlug } })
      .then((product) => setLines([{ product, qty: 1 }]))
      .catch(() => undefined);
  }, [addSlug]);

  useEffect(() => {
    const payRef = searchParams.get("pay");
    const mock = searchParams.get("mock");
    if (!payRef || mock !== "1") return;
    void bffCall("handlePaymentCallback", {
      params: { provider: "paystack" },
      body: {
        event: "charge.success",
        data: { reference: payRef, status: "success" },
      },
    })
      .then(() => {
        setOrderId(payRef);
        setTrackingNumber(payRef);
        setPhase("success");
      })
      .catch(() => undefined);
  }, [searchParams]);

  async function placeOrderOnServer() {
    const result = await bffCall<{
      id: string;
      trackingNumber: string;
      payment?: {
        reference?: string;
        authorizationUrl?: string;
        bank?: { bank: string; accountName: string; accountNumber: string };
      };
    }>("createCheckout", {
      body: {
        deliveryMethod: deliveryId,
        paymentMethod,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        city: form.city,
        streetAddress: form.streetAddress,
        state: form.state,
        note: form.note,
        items: lines.map((line) => ({
          slug: line.product.slug,
          qty: line.qty,
        })),
        idempotencyKey:
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `${Date.now()}`,
      },
    });
    setOrderId(result.id);
    setTrackingNumber(result.trackingNumber);
    setTransferReference(result.payment?.reference ?? result.id);
    setAuthorizationUrl(result.payment?.authorizationUrl ?? null);
    setBankDetails(result.payment?.bank ?? null);
    return result;
  }

  function validate() {
    const next: Partial<Record<keyof DeliveryFormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    if (!form.city.trim()) next.city = "City is required";
    if (!form.streetAddress.trim())
      next.streetAddress = "Street address is required";
    if (!form.state.trim()) next.state = "State is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function completeOrder(nextOrderId: string, nextTracking?: string) {
    setOrderId(nextOrderId);
    setTrackingNumber(nextTracking ?? trackingNumber ?? nextOrderId);
    setPhase("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContinue() {
    if (phase === "delivery") {
      if (!validate()) return;
      setPhase("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (phase === "review") {
      void (async () => {
        try {
          setCheckoutError(null);
          await placeOrderOnServer();
          setPhase(paymentMethod === "bank" ? "bank" : "card");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          setCheckoutError(
            error instanceof Error ? error.message : "Unable to place order",
          );
        }
      })();
    }
  }

  function handleTransferCompleted() {
    if (!orderId || !trackingNumber) return;
    completeOrder(orderId, trackingNumber);
  }

  function handleCardPlaceOrder() {
    if (authorizationUrl) {
      window.location.href = authorizationUrl;
      return;
    }
    if (!orderId || !trackingNumber) return;
    completeOrder(orderId, trackingNumber);
  }

  function handleChooseAnotherMethod() {
    setPhase("review");
    setTransferReference(null);
    setOrderId(null);
    setAuthorizationUrl(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (phase === "success" && orderId && trackingNumber) {
    return (
      <OrderPlacedSuccess
        orderId={orderId}
        trackingNumber={trackingNumber}
        form={form}
        delivery={delivery}
        paymentMethod={paymentMethod}
        lines={lines}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5">
        <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
          Checkout
        </h1>
        <p className="mt-1 text-sm text-[#8a8a8a]">
          Complete your order below.
        </p>
      </div>

      <div className="mb-6">
        <CheckoutSteps step={step} />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(280px,0.85fr)]">
        <div className="min-w-0">
          {phase === "delivery" ? (
            <DeliveryInformationForm
              form={form}
              errors={errors}
              onChange={updateForm}
              deliveryId={deliveryId}
              onDeliveryChange={setDeliveryId}
            />
          ) : null}

          {phase === "review" ? (
            <ReviewPayment
              form={form}
              delivery={delivery}
              lines={lines}
              paymentMethod={paymentMethod}
              onPaymentChange={setPaymentMethod}
              onEdit={() => setPhase("delivery")}
            />
          ) : null}

          {phase === "bank" && transferReference ? (
            <BankTransferPayment
              amount={total}
              transferReference={transferReference}
              payerName={form.fullName}
              bank={bankDetails}
            />
          ) : null}

          {phase === "card" ? (
            <CardPaymentForm
              authorizationUrl={authorizationUrl}
              onPay={handleCardPlaceOrder}
            />
          ) : null}
          {checkoutError ? (
            <p className="mt-3 text-sm text-[#d64545]">{checkoutError}</p>
          ) : null}
        </div>

        <div className="flex h-fit flex-col gap-3 lg:sticky lg:top-6">
          <OrderSummaryCard lines={lines} delivery={delivery} />

          {phase === "delivery" ? (
            <button
              type="button"
              onClick={handleContinue}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
            >
              Continue to Review
              <span aria-hidden>→</span>
            </button>
          ) : null}

          {phase === "review" ? (
            <>
              <button
                type="button"
                onClick={handleContinue}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
              >
                <PlaceOrderIcon />
                Place Order
              </button>
              <p className="text-center text-xs text-[#8a8a8a]">
                By placing your order, you agree to our Terms & Conditions.
              </p>
            </>
          ) : null}

          {phase === "bank" ? (
            <>
              <button
                type="button"
                onClick={handleTransferCompleted}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
              >
                <PlaceOrderIcon />
                I&apos;ve Completed the Transfer
              </button>
              <button
                type="button"
                onClick={handleChooseAnotherMethod}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-[#e5e5e5] bg-white text-sm font-semibold text-aurora-ink transition-colors hover:border-[#d0d0d0]"
              >
                Choose Another Method
              </button>
              <p className="text-center text-xs text-[#8a8a8a]">
                By placing your order, you agree to our Terms & Conditions.
              </p>
            </>
          ) : null}

          {phase === "card" ? (
            <>
              <button
                type="button"
                onClick={handleCardPlaceOrder}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90"
              >
                <PlaceOrderIcon />
                Place Order
              </button>
              <button
                type="button"
                onClick={handleChooseAnotherMethod}
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-[#e5e5e5] bg-white text-sm font-semibold text-aurora-ink transition-colors hover:border-[#d0d0d0]"
              >
                Choose Another Method
              </button>
              <p className="text-center text-xs text-[#8a8a8a]">
                By placing your order, you agree to our Terms & Conditions.
              </p>
            </>
          ) : null}
        </div>
      </div>

      {lines.length === 0 ? (
        <div className="mt-6 text-center text-sm text-[#8a8a8a]">
          No items in cart.{" "}
          <Link
            href="/shop"
            className="font-semibold text-aurora-ink underline"
          >
            Browse shop
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const addSlug = searchParams.get("add") ?? "";
  return <CheckoutPageContent key={addSlug} />;
}

export function CheckoutPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SHOP}>
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-6xl py-10 text-sm text-[#8a8a8a]">
            Loading checkout…
          </div>
        }
      >
        <CheckoutPageInner />
      </Suspense>
    </RequirePermission>
  );
}
