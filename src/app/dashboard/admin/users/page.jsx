"use client";
import { t } from "@/lib/i18n";
import { toast } from "sonner";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi, useAuth } from "@/lib/hooks";
import { fmtDate } from "@/lib/utils";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const { data, isLoading, mutate } = useApi("/admin/users", true);
  async function setRole(id, role) {
    try {
      await api(`/admin/users/${id}/role`, {
        method: "PATCH",
        auth: true,
        body: { role },
      });
      toast.success(t("Role updated"));
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
  }
  if (isLoading) return <Loading />;
  return (
    <>
      <Title>{t("User Management")}</Title>
      <TableShell
        head={["Name", "Email", "Phone", "Joined", "Role"]}
        empty={data?.length ? null : t("No users.")}>
        {(data || []).map((u) => (
          <tr key={u._id}>
            <td className="font-semibold">{u.name}</td>
            <td>{u.email}</td>
            <td>{u.phone || "-"}</td>
            <td>{fmtDate(u.createdAt)}</td>
            <td>
              <select
                className="select select-xs"
                disabled={u.email === me?.email}
                value={u.role || "customer"}
                onChange={(e) => setRole(u._id, e.target.value)}
                aria-label={t("Role")}>
                <option value="customer">{t("customer")}</option>
                <option value="admin">{t("admin")}</option>
              </select>
            </td>
          </tr>
        ))}
      </TableShell>
    </>
  );
}
