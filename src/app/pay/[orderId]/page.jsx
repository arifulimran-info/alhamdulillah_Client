"use client";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { Loading } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi, useAuth } from "@/lib/hooks";
import { t } from "@/lib/i18n";
import { PHONE_RE, cleanPhone, taka } from "@/lib/utils";

const WALLET_COLORS = {
  bkash: "#e2136e",
  nagad: "#f6921e",
  rocket: "#8c3494",
  upay: "#0b6cb8",
};
const walletColor = (n) =>
  WALLET_COLORS[n.toLowerCase().replace(/\s/g, "")] || "#2f5d3a";

export default function PayPage({ params }) {
  const { orderId } = use(params);
  const router = useRouter();
  const { isPending } = useAuth();
  const { data: order, isLoading } = useApi(
    isPending ? null : `/orders/${orderId}`,
    true,
  );
  const { data: methods } = useApi("/payments/methods");
  const [busy, setBusy] = useState("");
  const [wallet, setWallet] = useState("");
  const [sender, setSender] = useState("");
  const [trx, setTrx] = useState("");

  if (isPending || isLoading || !order || !methods)
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Loading />
      </div>
    );
  if (
    order.status !== "pending" ||
    order.paymentMethod !== "online" ||
    order.advancePaid > 0
  ) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-5xl">ℹ️</p>
        <h1 className="mt-3 text-xl font-semibold">
          {t("Nothing to pay for this order")}
        </h1>
        <Link
          href="/dashboard/customer/my-orders"
          className="btn btn-brand mt-5">
          {t("Go to My Orders")}
        </Link>
      </div>
    );
  }
  const amount =
    order.orderType === "preorder" ? order.advanceAmount : order.totalAmount;
  const none =
    !methods.sslcommerz && !methods.stripe && methods.manual.length === 0;

  async function go(gateway) {
    setBusy(gateway);
    try {
      const { url } = await api("/payments/create-session", {
        method: "POST",
        auth: true,
        body: { orderId, gateway },
      });
      window.location.href = url;
    } catch (e) {
      toast.error(e.message);
      setBusy("");
    }
  }
  async function submitManual(e) {
    e.preventDefault();
    if (!wallet) return toast.error(t("Please choose a payment method"));
    if (!PHONE_RE.test(cleanPhone(sender)))
      return toast.error(t("Enter the number you sent the money from"));
    if (!/^[A-Za-z0-9]{6,20}$/.test(trx.trim()))
      return toast.error(t("Enter a valid Transaction ID (TrxID)"));
    setBusy("manual");
    try {
      await api("/payments/manual", {
        method: "POST",
        auth: true,
        body: { orderId, wallet, senderNumber: sender, trxId: trx },
      });
      toast.success(t("Payment submitted. We will confirm it shortly."));
      router.push("/dashboard/customer/payments");
    } catch (err) {
      toast.error(err.message);
      setBusy("");
    }
  }
  const selected = methods.manual.find((w) => w.name === wallet);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="section-title">{t("Complete your payment")}</h1>
        <p className="mt-2 text-base-content/70">
          {t("Order")} <b>{order.orderNumber}</b> -{" "}
          {order.orderType === "preorder"
            ? t("Advance to pay now")
            : t("Amount to pay")}
          : <b className="text-primary">{taka(amount)}</b>
        </p>
      </div>

      {none && (
        <p className="rounded-box border border-base-300 p-5">
          {t("No online payment method is set up yet. Please contact us.")}
        </p>
      )}

      {methods.sslcommerz && (
        <section className="rounded-box border border-base-300 p-5">
          <h2 className="font-heading text-xl font-semibold">
            {t("bKash, Nagad, Rocket, Upay, cards and internet banking")}
          </h2>
          <p className="mt-1 text-sm text-base-content/70">
            {t(
              "You will choose your wallet, card or bank on the secure payment page.",
            )}
          </p>
          <div className="my-3 flex flex-wrap gap-2 text-xs font-semibold">
            {["bKash", "Nagad", "Rocket", "Upay"].map((n) => (
              <span
                key={n}
                className="rounded-full px-3 py-1 text-white"
                style={{ background: walletColor(n) }}>
                {n}
              </span>
            ))}
            <span className="rounded-full bg-neutral px-3 py-1 text-neutral-content">
              Visa / Mastercard
            </span>
            <span className="rounded-full bg-neutral px-3 py-1 text-neutral-content">
              {t("Internet banking")}
            </span>
          </div>
          <button
            className="btn btn-brand"
            disabled={!!busy}
            onClick={() => go("sslcommerz")}>
            {busy === "sslcommerz" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              `${t("Pay")} ${taka(amount)}`
            )}
          </button>
        </section>
      )}

      {methods.stripe && (
        <section className="rounded-box border border-base-300 p-5">
          <h2 className="font-heading text-xl font-semibold">
            {t("International card")}
          </h2>
          <p className="mt-1 text-sm text-base-content/70">
            {t("Visa, Mastercard and American Express through Stripe.")}
          </p>
          <button
            className="btn btn-outline mt-3"
            disabled={!!busy}
            onClick={() => go("stripe")}>
            {busy === "stripe" ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              t("Pay with card")
            )}
          </button>
        </section>
      )}

      {methods.manual.length > 0 && (
        <section className="rounded-box border border-base-300 p-5">
          <h2 className="font-heading text-xl font-semibold">
            {t("Send Money manually")}
          </h2>
          <p className="mt-1 text-sm text-base-content/70">
            {t(
              "Send the exact amount from your wallet app, then enter the TrxID below. We confirm it before processing your order.",
            )}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {methods.manual.map((w) => (
              <button
                type="button"
                key={w.name}
                onClick={() => setWallet(w.name)}
                className={`flex items-center justify-between rounded-lg border-2 p-3 text-left ${wallet === w.name ? "bg-base-200" : "border-base-300"}`}
                style={
                  wallet === w.name
                    ? { borderColor: walletColor(w.name) }
                    : undefined
                }>
                <span>
                  <b style={{ color: walletColor(w.name) }}>{w.name}</b>
                  <br />
                  <span className="text-sm">{w.number}</span>
                </span>
                <span
                  role="button"
                  aria-label="Copy number"
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard?.writeText(w.number);
                    toast(t("Number copied"));
                  }}>
                  <Copy size={14} />
                </span>
              </button>
            ))}
          </div>
          {selected && (
            <form onSubmit={submitManual} className="mt-4 space-y-3">
              <p className="rounded-lg bg-base-200 p-3 text-sm">
                {t("Open")} {selected.name} - <b>{t("Send Money")}</b> -{" "}
                {t("to")} <b>{selected.number}</b> - {t("amount")}{" "}
                <b>{taka(amount)}</b>.
              </p>
              <input
                className="input w-full"
                inputMode="tel"
                placeholder={t("Your number (the one you sent from)")}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
              <input
                className="input w-full uppercase"
                placeholder={t("Transaction ID (TrxID)")}
                value={trx}
                onChange={(e) => setTrx(e.target.value)}
              />
              <button className="btn btn-honey" disabled={!!busy}>
                {busy === "manual" ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  t("Submit payment")
                )}
              </button>
            </form>
          )}
        </section>
      )}
      <p className="text-center text-sm">
        <Link className="link" href="/dashboard/customer/my-orders">
          {t("Pay later from My Orders")}
        </Link>
      </p>
    </div>
  );
}
