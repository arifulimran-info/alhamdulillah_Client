"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import ProductGrid from "@/components/ProductGrid";
import { Title } from "@/components/dashboard/ui";
import { useHydrated } from "@/lib/hooks";
import { useWishlist } from "@/lib/stores";

export default function Wishlist() {
  const items = useWishlist((s) => s.items);
  const hydrated = useHydrated();
  if (!hydrated) return null;
  return (
    <>
      <Title>{t("Wishlist")}</Title>
      {items.length ? <ProductGrid items={items} /> : <p className="text-base-content/70">{t("Nothing saved yet. Tap the heart on any product.")} <Link className="link link-primary" href="/shop">{t("Browse products")}</Link></p>}
    </>
  );
}
