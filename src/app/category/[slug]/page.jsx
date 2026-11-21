"use client";
import { Suspense, use } from "react";
import { notFound } from "next/navigation";
import ShopClient from "@/components/ShopClient";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { t } from "@/lib/i18n";
import { categoryBySlug } from "@/lib/utils";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const cat = categoryBySlug(slug);
  if (!cat) notFound();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="section-title">
        {cat.emoji} {t(cat.name)}
      </h1>
      <p className="section-sub mb-6 mt-2">{t(cat.note)}</p>
      <Suspense fallback={<ProductGridSkeleton />}>
        <ShopClient fixedCategory={cat.name} />
      </Suspense>
    </div>
  );
}
