"use client";
import { t, pname } from "@/lib/i18n";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import ProductImage from "@/components/ProductImage";
import { useCart, useWishlist } from "@/lib/stores";
import { useHydrated } from "@/lib/hooks";
import { fmtDate, maxQty, taka } from "@/lib/utils";

export default function ProductCard({ product: p }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const wished = useWishlist((s) => s.items.some((i) => i._id === p._id));
  const toggleWish = useWishlist((s) => s.toggle);
  const hydrated = useHydrated();
  const left = maxQty(p);
  const pre = p.saleType === "preorder";
  const pct = pre ? Math.min(100, Math.round((p.preorderBooked / p.preorderQuota) * 100)) : 0;

  function handleAdd() {
    add(p, 1);
    toast.success(`${p.name}: ${t(pre ? "Added for pre-order" : "Added to cart")}`);
    if (pre) router.push("/cart");
  }

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
      <Link href={`/product/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <ProductImage product={p} className="transition-transform duration-500 group-hover:scale-105" />
        <span className={`badge absolute left-2 top-2 border-0 font-semibold ${pre ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"}`}>
          {pre ? t("Pre-order") : t("In Stock")}
        </span>
      </Link>
      <button aria-label={t("Save to wishlist")} onClick={() => { toggleWish(p); toast(wished ? t("Removed from wishlist") : t("Saved to wishlist")); }}
        className="btn btn-circle btn-xs absolute right-2 top-2 border-0 bg-base-100/90">
        <Heart size={14} className={hydrated && wished ? "fill-error text-error" : ""} />
      </button>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs text-base-content/60">{t(p.category)}</p>
        <Link href={`/product/${p.slug}`} className="line-clamp-2 min-h-[2.6rem] font-semibold leading-snug hover:text-primary">{pname(p)}</Link>
        <p className="font-heading text-lg font-bold text-primary">{taka(p.price)} <span className="text-xs font-normal text-base-content/60">/ {t(p.unit)}</span></p>
        {pre && (
          <div className="mt-1 space-y-1 text-xs text-base-content/70">
            <p>{t("Delivery {date} - pay {pct}% now", { date: fmtDate(p.expectedDeliveryDate), pct: p.advancePercent })}</p>
            <progress className="progress progress-secondary h-2 w-full" value={pct} max="100" />
            <p>{t("{n}/{q} booked", { n: p.preorderBooked, q: p.preorderQuota })}</p>
          </div>
        )}
        <div className="mt-auto pt-3">
          {left > 0 ? (
            <button onClick={handleAdd} className={`btn btn-sm w-full ${pre ? "btn-honey" : "btn-brand"}`}>{pre ? t("Pre-order Now") : t("Add to Cart")}</button>
          ) : (
            <button disabled className="btn btn-sm w-full">{pre ? t("Pre-order Closed") : t("Out of Stock")}</button>
          )}
        </div>
      </div>
    </div>
  );
}
