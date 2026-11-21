"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { mutate } from "swr";
import { toast } from "sonner";
import StatusBadge from "@/components/StatusBadge";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

export default function MyOrders() {
  const { data, isLoading } = useApi("/orders/my", true);

  async function cancel(id) {
    if (!confirm(t("Cancel this order?"))) return;
    try {
      await api(`/orders/${id}/cancel`, { method: "PATCH", auth: true });
      toast.success(t("Order cancelled"));
      mutate(["/orders/my", true]);
    } catch (e) {
      toast.error(e.message);
    }
  }
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("My Orders")}</Title>
      <TableShell
        head={[
          "Order",
          "Items",
          "Total",
          "Paid / Due",
          "Type",
          "Status",
          "Date",
          "",
        ]}
        empty={data?.length ? null : t("No orders yet.")}>
        {(data || []).map((o) => (
          <tr key={o._id}>
            <td className="font-semibold">{o.orderNumber}</td>
            <td className="max-w-48 text-sm">
              {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
            </td>
            <td>{taka(o.totalAmount)}</td>
            <td className="text-sm">
              {taka(o.advancePaid)} / {taka(o.dueAmount)}
            </td>
            <td>
              <span
                className={`badge badge-sm border-0 ${o.orderType === "preorder" ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"}`}>
                {o.orderType === "preorder" ? t("Pre-order") : t("In-stock")}
              </span>
            </td>
            <td>
              <StatusBadge status={o.status} />
            </td>
            <td className="whitespace-nowrap text-sm">
              {fmtDate(o.createdAt)}
            </td>
            <td className="space-x-1 whitespace-nowrap">
              {o.status === "pending" && o.paymentMethod === "online" && (
                <Link className="btn btn-brand btn-xs" href={`/pay/${o._id}`}>
                  {t("Pay now")}
                </Link>
              )}
              {o.status === "pending" && (
                <button
                  className="btn btn-outline btn-error btn-xs"
                  onClick={() => cancel(o._id)}>
                  {t("Cancel")}
                </button>
              )}
              <Link
                className="btn btn-ghost btn-xs"
                href={`/dashboard/customer/invoice/${o._id}`}>
                {t("Invoice")}
              </Link>
            </td>
          </tr>
        ))}
      </TableShell>
    </>
  );
}
