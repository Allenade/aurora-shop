"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { BankTransferPayment } from "@/components/cart/bank-transfer-payment";
import { CardPaymentForm } from "@/components/cart/card-payment-form";
import { CheckoutSteps } from "@/components/cart/checkout-steps";
import { DeliveryInformationForm } from "@/components/cart/delivery-information-form";
import { OrderPlacedSuccess } from "@/components/cart/order-placed-success";
import { OrderSummaryCard } from "@/components/cart/order-summary-card";
import { ReviewPayment } from "@/components/cart/review-payment";
import { CheckoutSkeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/ui/spinner";
import {
  DELIVERY_METHODS,
  getCartTotals,
  INITIAL_DELIVERY_FORM,
  type DeliveryFormState,
  type DeliveryMethodId,
  type PaymentMethodId,
} from "@/lib/cart";
import { useCart, type CartItem } from "@/lib/cart-store";
import { Action, Resource, RequirePermission } from "@/lib/permissions";
import type { ShopProduct } from "@/lib/shop";
import { bffCall } from "@/lib/bff/generated/client";
import { readReorderNotices } from "@/lib/reorder";

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

function cartItemToProduct(item: CartItem): ShopProduct {
  return {
    id: item.productId,
    slug: item.slug,
    name: item.name,
    subtitle: "",
    category: "",
    brand: "",
    subcategory: "",
    price: item.price,
    priceLabel: item.priceLabel,
    unitLabel: "Per unit",
    stockStatus: item.stockCount > 0 ? "in_stock" : "out_of_stock",
    stockCount: item.stockCount,
    image: item.image,
    images: [item.image],
    highlights: [],
    specs: [],
    datasheetNote: "",
    reviewsNote: "",
  };
}

type CartLine = {
  product: ShopProduct;
  qty: number;
};

type CheckoutPhase = "delivery" | "review" | "bank" | "card" | "success";

type PaymentStatusResponse = {
  reference: string;
  provider: "paystack" | "bank";
  status: "pending" | "success" | "failed" | "refunded" | "cancelled";
  paid: boolean;
  orderNumber?: string;
  trackingNumber?: string;
};

const PAYMENT_POLL_ATTEMPTS = 8;
const PAYMENT_POLL_DELAY_MS = 2000;

/** Paystack appends `reference`/`trxref`; our own callback URL carries `pay`. */
function paymentReturnReference(params: URLSearchParams) {
  return (
    params.get("reference") ?? params.get("trxref") ?? params.get("pay") ?? null
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const buySlug = searchParams.get("buy");
  const cart = useCart();

  const lines = useMemo<CartLine[]>(() => {
    const items = cart.items.map((item) => ({
      product: cartItemToProduct(item),
      qty: item.qty,
    }));
    if (!buySlug) return items;
    const preferred = items.find((line) => line.product.slug === buySlug);
    return preferred ? [preferred] : items;
  }, [cart.items, buySlug]);

  const [phase, setPhase] = useState<CheckoutPhase>("delivery");
  const [form, setForm] = useState<DeliveryFormState>(INITIAL_DELIVERY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof DeliveryFormState, string>>
  >({});
  const [shippingLoading, setShippingLoading] = useState(true);
  const [authorizationUrl, setAuthorizationUrl] = useState<string | null>(null);
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
  const [clearingCart, setClearingCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(
    () => paymentReturnReference(searchParams) !== null,
  );

  useEffect(() => {
    // sessionStorage is client-only; defer so we don't sync-set in the effect body
    const id = window.setTimeout(() => {
      const notices = readReorderNotices();
      for (const notice of notices) {
        toast.message(notice);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void bffCall<{
      fullName?: string;
      email?: string;
      phone?: string;
      streetAddress?: string;
      city?: string;
      state?: string;
      note?: string;
    }>("getShippingSettings")
      .then((data) => {
        if (cancelled) return;
        setForm({
          fullName: data.fullName?.trim() ?? "",
          email: data.email?.trim() ?? "",
          phone: data.phone?.trim() ?? "",
          streetAddress: data.streetAddress?.trim() ?? "",
          city: data.city?.trim() ?? "",
          state: data.state?.trim() ?? "",
          note: data.note?.trim() ?? "",
        });
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setShippingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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

  function clearPurchasedItems() {
    if (buySlug) {
      void cart.remove(buySlug);
      return;
    }
    void cart.clear();
  }

  useEffect(() => {
    const payRef = paymentReturnReference(searchParams);
    if (!payRef) return;

    let cancelled = false;

    // Paystack confirms out-of-band, so poll our own backend until it verifies.
    void (async () => {
      for (let attempt = 0; attempt < PAYMENT_POLL_ATTEMPTS; attempt += 1) {
        if (cancelled) return;
        try {
          const status = await bffCall<PaymentStatusResponse>(
            "getTransactionStatus",
            { params: { reference: payRef } },
          );
          if (cancelled) return;
          if (status.paid) {
            setConfirmingPayment(false);
            setPaymentMethod(status.provider === "bank" ? "bank" : "card");
            completeOrder(
              status.orderNumber ?? payRef,
              status.trackingNumber ?? undefined,
            );
            return;
          }
          if (status.status === "failed" || status.status === "cancelled") {
            setConfirmingPayment(false);
            toast.error("Payment was not completed. You can try again.");
            return;
          }
        } catch {
          // Keep polling — the webhook may still be in flight.
        }
        await new Promise((resolve) =>
          window.setTimeout(resolve, PAYMENT_POLL_DELAY_MS),
        );
      }
      if (cancelled) return;
      setConfirmingPayment(false);
      toast.message(
        "We haven't received confirmation yet. Check your orders in a moment.",
      );
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per pay callback
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
    clearPurchasedItems();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleContinue() {
    if (lines.length === 0) return;
    if (phase === "delivery") {
      if (!validate()) return;
      // Persist for next checkout (Nest also saves again on place-order).
      void bffCall("updateShippingSettings", {
        body: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          streetAddress: form.streetAddress.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          note: form.note.trim() || undefined,
        },
      }).catch(() => undefined);
      setPhase("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (phase === "review") {
      if (placingOrder) return;
      void (async () => {
        setPlacingOrder(true);
        try {
          await placeOrderOnServer();
          setPhase(paymentMethod === "bank" ? "bank" : "card");
          window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Unable to place order",
          );
        } finally {
          setPlacingOrder(false);
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

  async function handleClearCart() {
    if (clearingCart || lines.length === 0) return;
    setClearingCart(true);
    try {
      await cart.clear();
      toast.success("Cart cleared.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not clear cart.",
      );
    } finally {
      setClearingCart(false);
    }
  }

  if (confirmingPayment) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 py-20 text-center">
        <LoadingSpinner className="text-aurora-ink" />
        <p className="text-sm font-semibold text-aurora-ink">
          Confirming your payment…
        </p>
        <p className="text-sm text-[#8a8a8a]">
          This takes a few seconds. Please don&apos;t close this page.
        </p>
      </div>
    );
  }

  if (cart.loading || shippingLoading) {
    return <CheckoutSkeleton />;
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

  if (lines.length === 0) {
    return (
      <div className="mx-auto w-full max-w-6xl py-10">
        <div className="mb-5">
          <h1 className="text-[1.75rem] font-bold tracking-tight text-aurora-ink">
            Checkout
          </h1>
        </div>
        <p className="text-sm text-[#8a8a8a]">
          No items in cart.{" "}
          <Link
            href="/shop"
            className="font-semibold text-aurora-ink underline"
          >
            Browse shop
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
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

      <div className="grid w-full min-w-0 gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)]">
        <div className="min-w-0 w-full">
          {phase === "delivery" ? (
            <>
              {form.fullName ||
              form.email ||
              form.phone ||
              form.streetAddress ? (
                <p className="mb-3 text-sm text-[#8a8a8a]">
                  Details are prefilled from your saved address. Edit anything
                  before continuing.
                </p>
              ) : null}
              <DeliveryInformationForm
                form={form}
                errors={errors}
                onChange={updateForm}
                deliveryId={deliveryId}
                onDeliveryChange={setDeliveryId}
              />
            </>
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
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 lg:sticky lg:top-6 lg:h-fit">
          <OrderSummaryCard
            lines={lines}
            delivery={delivery}
            clearing={clearingCart}
            onClearCart={
              phase === "delivery" || phase === "review"
                ? () => void handleClearCart()
                : undefined
            }
          />

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
                disabled={placingOrder}
                aria-busy={placingOrder}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-aurora-lime text-sm font-semibold text-aurora-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {placingOrder ? (
                  <>
                    <LoadingSpinner />
                    <span>Placing order…</span>
                  </>
                ) : (
                  <>
                    <PlaceOrderIcon />
                    Place Order
                  </>
                )}
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
    </div>
  );
}

function CheckoutPageInner() {
  const searchParams = useSearchParams();
  const buySlug = searchParams.get("buy") ?? "";
  return <CheckoutPageContent key={buySlug} />;
}

export function CheckoutPage() {
  return (
    <RequirePermission action={Action.READ} resource={Resource.SHOP}>
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutPageInner />
      </Suspense>
    </RequirePermission>
  );
}
