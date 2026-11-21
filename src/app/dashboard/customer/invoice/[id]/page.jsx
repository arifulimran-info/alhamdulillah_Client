"use client";
import { t } from "@/lib/i18n";
import { use } from "react";
import { Loading } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

export default function Invoice({ params }) {
  const { id } = use(params);
  const { data: o, isLoading } = useApi(`/orders/${id}`, true);
  if (isLoading || !o) return <Loading />;
  return (
    <div className="mx-auto max-w-2xl rounded-box border border-base-300 p-6">
      <div className="no-print mb-4 text-right">
        <button className="btn btn-brand btn-sm" onClick={() => window.print()}>
          {t("Download / Print PDF")}
        </button>
      </div>
      <div className="flex justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary">
            AgroBazar
          </h1>
          <p className="text-sm">
            {t("Invoice")} {o.orderNumber}
          </p>
        </div>
        <p className="text-sm">{fmtDate(o.createdAt)}</p>
      </div>
      <div className="mt-4 text-sm">
        <b>{o.shippingInfo.name}</b>
        <br />
        {o.shippingInfo.phone}
        <br />
        {o.shippingInfo.address.details}, {o.shippingInfo.address.district},{" "}
        {o.shippingInfo.address.division}
      </div>
      <table className="table mt-5">
        <thead>
          <tr>
            <th>{t("Item")}</th>
            <th>{t("Qty")}</th>
            <th>{t("Price")}</th>
            <th className="text-right">{t("Amount")}</th>
          </tr>
        </thead>
        <tbody>
          {o.items.map((i) => (
            <tr key={i.productId}>
              <td>{i.name}</td>
              <td>
                {i.quantity} {i.unit}
              </td>
              <td>{taka(i.price)}</td>
              <td className="text-right">{taka(i.price * i.quantity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="ml-auto mt-4 w-56 space-y-1 text-sm">
        <p className="flex justify-between">
          <span>{t("Subtotal")}</span>
          <span>{taka(o.subtotal)}</span>
        </p>
        <p className="flex justify-between">
          <span>{t("Delivery")}</span>
          <span>{taka(o.deliveryCharge)}</span>
        </p>
        <p className="flex justify-between font-bold">
          <span>{t("Total")}</span>
          <span>{taka(o.totalAmount)}</span>
        </p>
        <p className="flex justify-between">
          <span>{t("Paid")}</span>
          <span>{taka(o.advancePaid)}</span>
        </p>
        <p className="flex justify-between">
          <span>{t("Due")}</span>
          <span>{taka(o.dueAmount)}</span>
        </p>
      </div>
    </div>
  );
}
