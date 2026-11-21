"use client";
import { t } from "@/lib/i18n";
import ProductGrid from "@/components/ProductGrid";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { useApi } from "@/lib/hooks";

export default function PreOrderPage() {
  const { data, isLoading } = useApi(
    "/products?saleType=preorder&limit=24&sort=newest",
  );
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title">{t("Pre-order the season")}</h1>
      <p className="section-sub mb-8 mt-2">
        {t(
          "Book your share now with a small advance. The rest is paid when your order arrives on the date shown.",
        )}
      </p>
      {isLoading ? (
        <ProductGridSkeleton count={6} />
      ) : (
        <ProductGrid items={data?.items || []} />
      )}
    </div>
  );
}
