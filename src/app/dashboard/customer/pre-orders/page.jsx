"use client";
import { t } from "@/lib/i18n";
import StatusBadge from "@/components/StatusBadge";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

export default function MyPreorders() {
  const { data, isLoading } = useApi("/orders/my?type=preorder", true);
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("My Pre-orders")}</Title>
      <TableShell
        head={[
          "Order",
          "Items",
          "Expected delivery",
          "Advance",
          "Due on delivery",
          "Status",
        ]}
        empty={data?.length ? null : t("You have no pre-orders yet.")}>
        {(data || []).map((o) => (
          <tr key={o._id}>
            <td className="font-semibold">{o.orderNumber}</td>
            <td className="max-w-48 text-sm">
              {o.items.map((i) => `${i.name} x${i.quantity}`).join(", ")}
            </td>
            <td>{fmtDate(o.expectedDeliveryDate)}</td>
            <td>
              {o.advancePaid > 0 ? (
                <span className="text-success">
                  {taka(o.advancePaid)} {t("paid")}
                </span>
              ) : (
                <span className="text-warning">
                  {taka(o.advanceAmount)} {t("unpaid")}
                </span>
              )}
            </td>
            <td>{taka(o.dueAmount)}</td>
            <td>
              <StatusBadge status={o.status} />
            </td>
          </tr>
        ))}
      </TableShell>
    </>
  );
}
