"use client";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const qs = new URLSearchParams({ ...(type && { orderType: type }), ...(status && { status }) }).toString();
  const { data, isLoading, mutate } = useApi(`/admin/orders${qs ? `?${qs}` : ""}`, true);

  async function update(id, s) {
    try { await api(`/admin/orders/${id}/status`, { method: "PATCH", auth: true, body: { status: s } }); toast.success(t("Status set to {s}", { s: t(s) })); mutate(); }
    catch (e) { toast.error(e.message); }
  }
  async function markPaid(id) {
    try { await api(`/admin/orders/${id}/mark-paid`, { method: "PATCH", auth: true }); toast.success(t("Marked as paid")); mutate(); }
    catch (e) { toast.error(e.message); }
  }
  return (
    <>
      <Title action={
        <div className="flex gap-2">
          <select className="select select-sm" value={type} onChange={(e) => setType(e.target.value)} aria-label={t("Order type")}><option value="">{t("All types")}</option><option value="instock">{t("In-stock")}</option><option value="preorder">{t("Pre-order")}</option></select>
          <select className="select select-sm" value={status} onChange={(e) => setStatus(e.target.value)} aria-label={t("Status")}><option value="">{t("All statuses")}</option>{STATUSES.map((s) => <option key={s} className="capitalize">{s}</option>)}</select>
        </div>
      }>{t("Order Management")}</Title>
      {isLoading ? <Loading /> : (
        <TableShell head={["Order", "Customer", "Items", "Total", "Paid / Due", "Type", "Status", "Date", ""]} empty={data?.length ? null : t("No orders found.")}>
          {data.map((o) => {
            const closed = ["cancelled", "delivered"].includes(o.status);
            return (
              <tr key={o._id}>
                <td className="font-semibold">{o.orderNumber}</td>
                <td className="text-sm">{o.shippingInfo.name}<br /><span className="text-base-content/60">{o.shippingInfo.phone}</span></td>
                <td className="max-w-44 text-sm">{o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}</td>
                <td>{taka(o.totalAmount)}</td>
                <td className="text-sm">{taka(o.advancePaid)} / {taka(o.dueAmount)}</td>
                <td className="text-sm capitalize">{t(o.orderType)}</td>
                <td><StatusBadge status={o.status} /></td>
                <td className="whitespace-nowrap text-sm">{fmtDate(o.createdAt)}</td>
                <td className="whitespace-nowrap space-x-1">
                  {!closed && <select className="select select-xs w-28" value={o.status} onChange={(e) => update(o._id, e.target.value)} aria-label={t("Update status")}>{STATUSES.map((s) => <option key={s} value={s}>{t(s)}</option>)}</select>}
                  {o.status !== "cancelled" && o.dueAmount > 0 && o.advancePaid > 0 || (o.paymentMethod === "cod" && o.status !== "cancelled" && o.dueAmount > 0) ? <button className="btn btn-honey btn-xs" onClick={() => markPaid(o._id)}>{t("Mark as Paid")}</button> : null}
                </td>
              </tr>
            );
          })}
        </TableShell>
      )}
    </>
  );
}
