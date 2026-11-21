"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-6xl">🛑</p>
      <h1 className="mt-3 text-2xl font-semibold">{t("Payment cancelled")}</h1>
      <p className="mt-2 text-base-content/70">
        {t(
          "Your order is saved as pending. Pay from My Orders whenever you are ready, or cancel it there.",
        )}
      </p>
      <Link href="/dashboard/customer/my-orders" className="btn btn-brand mt-6">
        {t("Go to My Orders")}
      </Link>
    </div>
  );
}
