"use client";
import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";
import Pagination from "@/components/Pagination";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { useApi } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/utils";

// Every filter lives in the URL; the Express API does the filtering in MongoDB.
export default function ShopClient({ fixedCategory }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const get = (k, d = "") => sp.get(k) ?? d;
  const [search, setSearch] = useState(get("search"));

  const set = (patch) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in patch)) next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const t = setTimeout(() => { if (search !== get("search")) set({ search }); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const qs = new URLSearchParams();
  const category = fixedCategory || get("category");
  if (category) qs.set("category", category);
  ["search", "saleType", "minPrice", "maxPrice", "sort", "page"].forEach((k) => get(k) && qs.set(k, get(k)));
  qs.set("limit", "12");
  const { data, isLoading, error } = useApi(`/products?${qs.toString()}`);

  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
      <aside className="space-y-4 rounded-box border border-base-300 p-4 lg:sticky lg:top-24 lg:self-start">
        <label className="input w-full"><Search size={16} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("Search by name")} /></label>
        {!fixedCategory && (
          <select className="select w-full" value={get("category")} onChange={(e) => set({ category: e.target.value })} aria-label={t("Category")}>
            <option value="">{t("All categories")}</option>
            {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{t(c.name)}</option>)}
          </select>
        )}
        <select className="select w-full" value={get("saleType")} onChange={(e) => set({ saleType: e.target.value })} aria-label={t("Sale type")}>
          <option value="">{t("In-stock and Pre-order")}</option><option value="instock">{t("In-stock only")}</option><option value="preorder">{t("Pre-order only")}</option>
        </select>
        <div className="flex gap-2">
          <input type="number" min="0" className="input w-full" placeholder={t("Min ৳")} defaultValue={get("minPrice")} onBlur={(e) => set({ minPrice: e.target.value })} />
          <input type="number" min="0" className="input w-full" placeholder={t("Max ৳")} defaultValue={get("maxPrice")} onBlur={(e) => set({ maxPrice: e.target.value })} />
        </div>
        <select className="select w-full" value={get("sort", "newest")} onChange={(e) => set({ sort: e.target.value })} aria-label={t("Sort")}>
          <option value="newest">{t("Newest first")}</option><option value="price_asc">{t("Price: low to high")}</option><option value="price_desc">{t("Price: high to low")}</option>
        </select>
      </aside>
      <div>
        {isLoading ? <ProductGridSkeleton count={6} /> : error ? <p className="text-error">{error.message}</p> : data.items.length === 0 ? (
          <div className="rounded-box border border-dashed border-base-300 p-10 text-center">
            <p className="font-semibold">{t("No products match these filters")}</p>
            <button className="btn btn-sm btn-outline mt-3" onClick={() => { setSearch(""); router.replace(pathname); }}>{t("Clear filters")}</button>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-base-content/60">{t("{n} products", { n: data.total })}</p>
            <ProductGrid items={data.items} />
            <Pagination page={data.page} pages={data.pages} onChange={(p) => set({ page: String(p) })} />
          </>
        )}
      </div>
    </div>
  );
}
