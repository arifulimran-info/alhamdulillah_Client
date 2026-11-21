"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { Loading, StatCard, Title } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";

export default function CustomerOverview() {
  const { data, isLoading } = useApi("/users/customer-stats", true);
  return (
    <>
      <Title action={<Link href="/shop" className="btn btn-brand btn-sm">{t("Shop now")}</Link>}>{t("Overview")}</Title>
      {isLoading ? <Loading /> : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard label={t("Total orders")} value={data?.totalOrders ?? 0} />
          <StatCard label={t("Pending orders")} value={data?.pendingOrders ?? 0} />
          <StatCard label={t("Delivered orders")} value={data?.deliveredOrders ?? 0} />
          <StatCard label={t("Active pre-orders")} value={data?.activePreorders ?? 0} />
        </div>
      )}
    </>
  );
}
