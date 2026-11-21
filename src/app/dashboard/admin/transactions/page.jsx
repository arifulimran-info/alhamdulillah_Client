"use client";
import { toast } from "sonner";
import { t } from "@/lib/i18n";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { fmtDate, taka } from "@/lib/utils";

const STATUS = {
  paid: "badge-success",
  pending: "badge-warning",
  rejected: "badge-error",
};

export default function Transactions() {
  const { data, isLoading, mutate } = useApi("/admin/transactions", true);

  async function review(id, action) {
    if (action === "reject" && !confirm(t("Reject this payment?"))) return;
    try {
      const r = await api(`/admin/payments/${id}/${action}`, {
        method: "PATCH",
        auth: true,
      });
      if (r.ok === false)
        toast.error(
          r.reason === "quota_full"
            ? t("Quota was full: the order was cancelled, refund the customer.")
            : t("The order could not be updated."),
        );
      else
        toast.success(
          t(action === "approve" ? "Payment approved" : "Payment rejected"),
        );
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
  }
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("Transactions")}</Title>
      <TableShell
        head={[
          "Customer",
          "Order",
          "Amount",
          "Method",
          "Type",
          "Status",
          "Transaction ID",
          "Date",
          "",
        ]}
        empty={data?.length ? null : t("No transactions yet.")}>
        {(data || []).map((p) => (
          <tr key={p._id}>
            <td>
              {p.userName}
              <br />
              <span className="text-xs text-base-content/60">
                {p.userEmail}
              </span>
            </td>
            <td className="font-semibold">{p.orderNumber}</td>
            <td>{taka(p.amount)}</td>
            <td className="text-sm">
              {p.method || p.gateway}
              {p.senderNumber && (
                <>
                  <br />
                  <span className="text-xs text-base-content/60">
                    {t("from")} {p.senderNumber}
                  </span>
                </>
              )}
            </td>
            <td className="capitalize">{t(p.paymentType)}</td>
            <td>
              <span
                className={`badge badge-sm ${STATUS[p.paymentStatus] || ""}`}>
                {t(p.paymentStatus)}
              </span>
            </td>
            <td className="max-w-40 truncate text-xs">{p.transactionId}</td>
            <td>{fmtDate(p.paidAt || p.submittedAt)}</td>
            <td className="whitespace-nowrap space-x-1">
              {p.paymentStatus === "pending" && (
                <>
                  <button
                    className="btn btn-brand btn-xs"
                    onClick={() => review(p._id, "approve")}>
                    {t("Approve")}
                  </button>
                  <button
                    className="btn btn-outline btn-error btn-xs"
                    onClick={() => review(p._id, "reject")}>
                    {t("Reject")}
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </TableShell>
    </>
  );
}
