"use client";
import { t, pdesc, pname } from "@/lib/i18n";
import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import ProductImage from "@/components/ProductImage";
import { PageSkeleton } from "@/components/Skeletons";
import { useApi, useHydrated } from "@/lib/hooks";
import { useCart, useWishlist } from "@/lib/stores";
import { fmtDate, maxQty, taka } from "@/lib/utils";

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const { data: p, isLoading, error } = useApi(`/products/${slug}`);
  const router = useRouter();
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = useWishlist((s) => p && s.items.some((i) => i._id === p._id));
  const hydrated = useHydrated();
  const [qty, setQty] = useState(1);

  if (isLoading) return <PageSkeleton />;
  if (error || !p)
    return (
      <div className="py-24 text-center">
        <p className="font-semibold">{t("Product not found")}</p>
        <Link href="/shop" className="btn btn-brand mt-4">
          {t("Back to shop")}
        </Link>
      </div>
    );

  const pre = p.saleType === "preorder";
  const left = maxQty(p);
  const pct = pre ? Math.round((p.preorderBooked / p.preorderQuota) * 100) : 0;

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-box border border-base-300">
        <ProductImage product={p} />
      </div>
      <div className="space-y-4">
        <span
          className={`badge border-0 font-semibold ${pre ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"}`}>
          {pre ? t("Pre-order") : t("In Stock")}
        </span>
        <h1 className="section-title">{pname(p)}</h1>
        <p className="text-sm text-base-content/60">{t(p.category)}</p>
        <p className="font-heading text-3xl font-bold text-primary">
          {taka(p.price)}{" "}
          <span className="text-base font-normal text-base-content/60">
            {t("per")} {t(p.unit)}
          </span>
        </p>
        <p className="leading-relaxed text-base-content/80">{pdesc(p)}</p>
        {pre ? (
          <div className="space-y-2 rounded-box bg-base-200 p-4 text-sm">
            <p>
              <b>{t("Expected delivery:")}</b> {fmtDate(p.expectedDeliveryDate)}
            </p>
            <p>
              <b>{t("Advance now:")}</b> {p.advancePercent}% (
              {taka(Math.round((p.price * p.advancePercent) / 100))} per{" "}
              {p.unit}). The rest is paid on delivery.
            </p>
            <progress
              className="progress progress-secondary w-full"
              value={pct}
              max="100"
            />
            <p>
              {t("{n} of {q} {unit} still open", {
                n: left,
                q: p.preorderQuota,
                unit: t(p.unit),
              })}
            </p>
          </div>
        ) : (
          <p className="text-sm">
            {left > 0 ? (
              <span className="text-success font-semibold">
                {left} {p.unit} in stock
              </span>
            ) : (
              <span className="text-error font-semibold">
                {t("Out of stock")}
              </span>
            )}
          </p>
        )}
        {left > 0 ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="join">
              <button
                className="btn join-item btn-sm"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label={t("Decrease")}>
                <Minus size={14} />
              </button>
              <span className="join-item grid w-12 place-items-center border border-base-300 text-sm">
                {qty}
              </span>
              <button
                className="btn join-item btn-sm"
                onClick={() => setQty((q) => Math.min(left, q + 1))}
                aria-label={t("Increase")}>
                <Plus size={14} />
              </button>
            </div>
            <button
              className={`btn ${pre ? "btn-honey" : "btn-brand"}`}
              onClick={() => {
                add(p, qty);
                toast.success(t("Added to cart"));
                if (pre) router.push("/cart");
              }}>
              {pre ? t("Pre-order Now") : t("Add to Cart")}
            </button>
            <button
              className="btn btn-outline btn-circle"
              aria-label={t("Wishlist")}
              onClick={() => toggleWish(p)}>
              <Heart
                size={18}
                className={hydrated && wished ? "fill-error text-error" : ""}
              />
            </button>
          </div>
        ) : (
          <button disabled className="btn">
            {pre ? t("Pre-order Closed") : t("Out of Stock")}
          </button>
        )}
      </div>
    </div>
  );
}
