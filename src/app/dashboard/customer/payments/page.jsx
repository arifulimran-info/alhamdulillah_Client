"use client";
import { t } from "@/lib/i18n";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

const STATUS = { paid: "badge-success", pending: "badge-warning", rejected: "badge-error" };

export default function Payments() {
  const { data, isLoading } = useApi("/payments/my", true);
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("Payment History")}</Title>
      <TableShell head={["Order", "Amount", "Method", "Type", "Status", "Transaction ID", "Date"]} empty={data?.length ? null : t("No payments yet.")}>
        {(data || []).map((p) => (
          <tr key={p._id}>
            <td className="font-semibold">{p.orderNumber}</td><td>{taka(p.amount)}</td><td className="text-sm">{p.method || p.gateway}</td>
            <td className="capitalize">{t(p.paymentType)}</td>
            <td><span className={`badge badge-sm ${STATUS[p.paymentStatus] || ""}`}>{t(p.paymentStatus === "pending" ? "Verifying" : p.paymentStatus)}</span></td>
            <td className="max-w-40 truncate text-xs">{p.transactionId}</td><td>{fmtDate(p.paidAt || p.submittedAt)}</td>
          </tr>
        ))}
      </TableShell>
    </>
  );
}
