"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { t } from "@/lib/i18n";

function Inner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");
  // SSLCommerz is verified on the server before it redirects here (?order=&ok=)
  const sslOrder = sp.get("order");
  const [state, setState] = useState(
    sessionId
      ? { loading: true }
      : {
          loading: false,
          ok: sp.get("ok") === "1",
          orderNumber: sslOrder,
          reason: sp.get("reason"),
        },
  );

  useEffect(() => {
    if (!sessionId) return;
    api("/payments/verify", { method: "POST", auth: true, body: { sessionId } })
      .then((r) => setState({ loading: false, ...r }))
      .catch((e) => setState({ loading: false, error: e.message }));
  }, [sessionId]);

  if (state.loading)
    return (
      <div className="py-24 text-center">
        <span className="loading loading-spinner loading-lg text-primary" />
        <p className="mt-3">{t("Confirming your payment...")}</p>
      </div>
    );
  const ok = state.ok && !state.error;
  const msg = ok
    ? t("Order {no} is confirmed.", { no: state.orderNumber })
    : state.reason === "quota_full"
      ? t(
          "The pre-order quota filled just before your payment. Contact us for a refund.",
        )
      : t(
          state.error ||
            "If money was deducted, contact us with your order number.",
        );
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl">{ok ? "✅" : "⚠️"}</p>
      <h1 className="mt-3 text-2xl font-semibold">
        {ok ? t("Payment received") : t("We could not confirm this payment")}
      </h1>
      <p className="mt-2 text-base-content/70">{msg}</p>
      <Link href="/dashboard/customer/my-orders" className="btn btn-brand mt-6">
        {t("View my orders")}
      </Link>
    </div>
  );
}
export default function PaymentSuccess() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
