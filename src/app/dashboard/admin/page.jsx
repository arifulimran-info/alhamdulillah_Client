"use client";
import { t } from "@/lib/i18n";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Loading, StatCard, Title } from "@/components/dashboard/ui";
import { useApi } from "@/lib/hooks";
import { taka } from "@/lib/utils";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function AdminOverview() {
  const { data, isLoading } = useApi("/admin/stats", true);
  if (isLoading || !data) return <Loading />;
  const chart = data.monthly.map((m) => ({
    month: `${MONTHS[m.month - 1]} ${String(m.year).slice(2)}`,
    sales: m.sales,
  }));
  return (
    <>
      <Title>{t("Overview")}</Title>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label={t("Total sales")}
          value={taka(data.totalSales)}
          hint={t("Money received")}
        />
        <StatCard label={t("Total orders")} value={data.totalOrders} />
        <StatCard label={t("Pending orders")} value={data.pendingOrders} />
        <StatCard label={t("Customers")} value={data.totalCustomers} />
        <StatCard
          label={t("Low-stock products")}
          value={data.lowStock}
          hint="10 or fewer left"
        />
      </div>
      <div className="mt-6 rounded-box border border-base-300 p-4">
        <h2 className="mb-3 font-heading text-lg font-semibold">
          {t("Monthly sales")}
        </h2>
        {chart.length === 0 ? (
          <p className="py-10 text-center text-base-content/60">
            {t("No sales yet.")}
          </p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => taka(v)} />
                <Bar dataKey="sales" fill="#2f5d3a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}
