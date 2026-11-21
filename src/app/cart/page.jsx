"use client";
import { t, pname } from "@/lib/i18n";
import { useEffect } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProductImage from "@/components/ProductImage";
import { api } from "@/lib/api";
import { useHydrated } from "@/lib/hooks";
import { useCart } from "@/lib/stores";
import { taka } from "@/lib/utils";

export default function CartPage() {
  const hydrated = useHydrated();
  const { items, setQty, remove, clear, sync } = useCart();

  // Refresh prices and stock from the server once the persisted cart is loaded
  useEffect(() => {
    if (!hydrated) return;
    const ids = useCart.getState().items.map((i) => i.productId);
    if (ids.length)
      api("/products/by-ids", { method: "POST", body: { ids } })
        .then(sync)
        .catch(() => {});
  }, [hydrated, sync]);

  if (!hydrated)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="skeleton h-48 w-full" />
      </div>
    );
  if (!items.length) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-5xl">🧺</p>
        <h1 className="mt-3 text-xl font-semibold">
          {t("Your cart is empty")}
        </h1>
        <p className="mt-1 text-base-content/70">
          {t("Add honey, ghee or a seasonal pre-order to get started.")}
        </p>
        <Link href="/shop" className="btn btn-brand mt-5">
          {t("Browse the shop")}
        </Link>
      </div>
    );
  }
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const hasPre = items.some((i) => i.saleType === "preorder");
  const hasStock = items.some((i) => i.saleType === "instock");

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="section-title">{t("Your cart")}</h1>
          <button
            className="btn btn-ghost btn-sm text-error"
            onClick={() => {
              clear();
              toast(t("Cart cleared"));
            }}>
            {t("Clear cart")}
          </button>
        </div>
        <ul className="divide-y divide-base-300 rounded-box border border-base-300">
          {items.map((i) => (
            <li key={i.productId} className="flex gap-3 p-3">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
                <ProductImage product={i} />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link
                  href={`/product/${i.slug}`}
                  className="truncate font-semibold hover:text-primary">
                  {pname(i)}
                </Link>
                <span
                  className={`badge badge-sm border-0 ${i.saleType === "preorder" ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"}`}>
                  {i.saleType === "preorder" ? t("Pre-order") : t("In Stock")}
                </span>
                <p className="text-sm text-base-content/70">
                  {taka(i.price)} / {t(i.unit)}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="join">
                    <button
                      className="btn join-item btn-xs"
                      aria-label={t("Decrease")}
                      onClick={() => setQty(i.productId, i.quantity - 1)}>
                      <Minus size={12} />
                    </button>
                    <span className="join-item grid w-10 place-items-center border border-base-300 text-sm">
                      {i.quantity}
                    </span>
                    <button
                      className="btn join-item btn-xs"
                      aria-label={t("Increase")}
                      disabled={i.quantity >= i.max}
                      onClick={() => setQty(i.productId, i.quantity + 1)}>
                      <Plus size={12} />
                    </button>
                  </div>
                  <b>{taka(i.price * i.quantity)}</b>
                  <button
                    className="btn btn-ghost btn-xs text-error"
                    aria-label={t("Remove")}
                    onClick={() => remove(i.productId)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="h-fit space-y-3 rounded-box border border-base-300 p-5 lg:sticky lg:top-24">
        <h2 className="font-heading text-xl font-semibold">{t("Summary")}</h2>
        <p className="flex justify-between">
          <span>{t("Subtotal")}</span>
          <b>{taka(subtotal)}</b>
        </p>
        <p className="text-sm text-base-content/65">
          {t("Delivery (৳60 in Dhaka, ৳120 elsewhere) is added at checkout.")}
        </p>
        {hasPre && hasStock && (
          <p className="rounded-lg bg-base-200 p-2 text-sm">
            {t(
              "In-stock and pre-order items ship separately, so they become two orders.",
            )}
          </p>
        )}
        <Link href="/checkout" className="btn btn-brand w-full">
          {t("Proceed to checkout")}
        </Link>
      </aside>
    </div>
  );
}
