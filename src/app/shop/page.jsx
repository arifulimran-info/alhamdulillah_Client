"use client";
import { t } from "@/lib/i18n";
import { Suspense } from "react";
import ShopClient from "@/components/ShopClient";
import { ProductGridSkeleton } from "@/components/Skeletons";

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title mb-6">{t("Shop all products")}</h1>
      <Suspense fallback={<ProductGridSkeleton />}><ShopClient /></Suspense>
    </div>
  );
}
