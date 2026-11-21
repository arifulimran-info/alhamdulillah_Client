"use client";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { STATUS_STEPS, fmtDate, taka } from "@/lib/utils";

export default function TrackOrder() {
  const [orderNumber, setN] = useState("");
  const [phone, setP] = useState("");
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setOrder(null);
    try {
      setOrder(
        await api(
          `/orders/track?orderNumber=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`,
        ),
      );
    } catch (err) {
      toast.error(err.message);
    }
    setBusy(false);
  }
  const idx = order ? STATUS_STEPS.indexOf(order.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="section-title">{t("Track your order")}</h1>
      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          required
          className="input w-full"
          placeholder={t("Order number (AB-...)")}
          value={orderNumber}
          onChange={(e) => setN(e.target.value)}
        />
        <input
          required
          className="input w-full"
          placeholder={t("Phone number")}
          inputMode="tel"
          value={phone}
          onChange={(e) => setP(e.target.value)}
        />
        <button disabled={busy} className="btn btn-brand">
          {busy ? t("Searching...") : t("Track")}
        </button>
      </form>
      {order && (
        <div className="mt-8 space-y-4 rounded-box border border-base-300 p-5">
          <div className="flex items-center justify-between">
            <b>{order.orderNumber}</b>
            <StatusBadge status={order.status} />
          </div>
          {order.status === "cancelled" ? (
            <p className="text-error">{t("This order was cancelled.")}</p>
          ) : (
            <ul className="steps steps-vertical sm:steps-horizontal w-full">
              {STATUS_STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`step capitalize ${i <= idx ? "step-primary" : ""}`}>
                  {t(s)}
                </li>
              ))}
            </ul>
          )}
          <ul className="text-sm text-base-content/80">
            {order.items.map((i) => (
              <li key={i.name}>
                {i.name} x {i.quantity}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            {t("Total")} {taka(order.totalAmount)} - {t("Paid")}{" "}
            {taka(order.advancePaid)} - {t("Due")} {taka(order.dueAmount)}
          </p>
          {order.expectedDeliveryDate && (
            <p className="text-sm">
              {t("Expected delivery:")} {fmtDate(order.expectedDeliveryDate)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
