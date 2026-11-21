"use client";
import { t } from "@/lib/i18n";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

export default function AdminPreorders() {
  const { data, isLoading } = useApi("/admin/preorders", true);
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("Pre-order Overview")}</Title>
      <p className="mb-4 text-sm text-base-content/70">{t("Booked quantity is what you need to collect or produce. Booked counts only orders whose advance has been paid.")}</p>
      <TableShell head={["Product", "Delivery date", "Booked / Quota", "Fill", "Advance collected"]} empty={data?.length ? null : t("No pre-order products.")}>
        {(data || []).map((p) => {
          const pct = Math.round((p.preorderBooked / p.preorderQuota) * 100);
          return (
            <tr key={p._id}>
              <td className="font-semibold">{p.name}</td>
              <td>{fmtDate(p.expectedDeliveryDate)}</td>
              <td>{p.preorderBooked} / {p.preorderQuota} {p.unit}</td>
              <td className="w-40"><progress className="progress progress-secondary w-full" value={pct} max="100" /></td>
              <td>{taka(p.totalAdvance)}</td>
            </tr>
          );
        })}
      </TableShell>
    </>
  );
}
