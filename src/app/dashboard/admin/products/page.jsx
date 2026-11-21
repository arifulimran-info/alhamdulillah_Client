"use client";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ProductImage from "@/components/ProductImage";
import { Loading, TableShell, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { uploadToImgBB } from "@/lib/imgbb";
import { CATEGORIES, taka } from "@/lib/utils";

const blank = {
  name: "",
  category: CATEGORIES[0].name,
  description: "",
  price: "",
  unit: "kg",
  saleType: "instock",
  stock: "",
  preorderQuota: "",
  expectedDeliveryDate: "",
  advancePercent: 30,
  image: "",
  isActive: true,
};

function ProductForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState(initial);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) =>
    setF({
      ...f,
      [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });

  async function pick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading(t("Uploading image..."));
    try {
      setF((x) => ({ ...x }));
      const url = await uploadToImgBB(file);
      setF((x) => ({ ...x, image: url }));
      toast.success(t("Image uploaded"), { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const body = {
        ...f,
        expectedDeliveryDate: f.expectedDeliveryDate || undefined,
      };
      await api(f._id ? `/admin/products/${f._id}` : "/admin/products", {
        method: f._id ? "PUT" : "POST",
        auth: true,
        body,
      });
      toast.success(t(f._id ? "Product updated" : "Product added"));
      onSaved();
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }
  const pre = f.saleType === "preorder";
  return (
    <dialog open className="modal modal-open">
      <form
        onSubmit={save}
        className="modal-box max-h-[90vh] max-w-2xl space-y-3 overflow-y-auto">
        <h3 className="font-heading text-xl font-bold">
          {f._id ? t("Edit product") : t("Add product")}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            className="input w-full sm:col-span-2"
            placeholder={t("Product name")}
            value={f.name}
            onChange={set("name")}
          />
          <input
            className="input w-full sm:col-span-2"
            placeholder={t("Product name (Bengali, optional)")}
            value={f.nameBn ?? ""}
            onChange={set("nameBn")}
          />
          <select
            className="select w-full"
            value={f.category}
            onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.name}>
                {t(c.name)}
              </option>
            ))}
          </select>
          <select
            className="select w-full"
            value={f.saleType}
            onChange={set("saleType")}>
            <option value="instock">{t("In-stock")}</option>
            <option value="preorder">{t("Pre-order")}</option>
          </select>
          <input
            required
            type="number"
            min="1"
            className="input w-full"
            placeholder={t("Price (৳)")}
            value={f.price}
            onChange={set("price")}
          />
          <select
            className="select w-full"
            value={f.unit}
            onChange={set("unit")}>
            <option value="kg">{t("kg")}</option>
            <option value="litre">{t("litre")}</option>
            <option value="piece">{t("piece")}</option>
          </select>
          {!pre ? (
            <input
              required
              type="number"
              min="0"
              className="input w-full"
              placeholder={t("Stock")}
              value={f.stock ?? ""}
              onChange={set("stock")}
            />
          ) : (
            <>
              <input
                required
                type="number"
                min="1"
                className="input w-full"
                placeholder={t("Pre-order quota")}
                value={f.preorderQuota ?? ""}
                onChange={set("preorderQuota")}
              />
              <input
                required
                type="date"
                className="input w-full"
                value={
                  f.expectedDeliveryDate
                    ? String(f.expectedDeliveryDate).slice(0, 10)
                    : ""
                }
                onChange={set("expectedDeliveryDate")}
              />
              <input
                required
                type="number"
                min="1"
                max="100"
                className="input w-full"
                placeholder={t("Advance %")}
                value={f.advancePercent ?? ""}
                onChange={set("advancePercent")}
              />
            </>
          )}
          <textarea
            className="textarea w-full sm:col-span-2"
            rows={3}
            placeholder={t("Description")}
            value={f.description}
            onChange={set("description")}
          />
          <textarea
            className="textarea w-full sm:col-span-2"
            rows={3}
            placeholder={t("Description (Bengali, optional)")}
            value={f.descriptionBn ?? ""}
            onChange={set("descriptionBn")}
          />
          <div className="flex items-center gap-3 sm:col-span-2">
            {f.image && (
              /* eslint-disable-next-line @next/next/no-img-element */ <img
                src={f.image}
                alt=""
                className="h-14 w-14 rounded object-cover"
              />
            )}
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-sm"
              onChange={pick}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="checkbox checkbox-sm checkbox-primary"
              checked={f.isActive}
              onChange={set("isActive")}
            />{" "}
            {t("Visible in shop")}
          </label>
        </div>
        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            {t("Cancel")}
          </button>
          <button disabled={busy} className="btn btn-brand">
            {busy ? t("Saving...") : t("Save product")}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export default function AdminProducts() {
  const { data, isLoading, mutate } = useApi("/admin/products", true);
  const [editing, setEditing] = useState(null);

  async function toggle(id) {
    try {
      await api(`/admin/products/${id}/toggle`, {
        method: "PATCH",
        auth: true,
      });
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
  }
  async function remove(p) {
    if (!confirm(t('Delete "{name}"?', { name: p.name }))) return;
    try {
      await api(`/admin/products/${p._id}`, { method: "DELETE", auth: true });
      toast.success(t("Product deleted"));
      mutate();
    } catch (e) {
      toast.error(e.message);
    }
  }
  if (isLoading) return <Loading />;
  return (
    <>
      <Title
        action={
          <button
            className="btn btn-brand btn-sm"
            onClick={() => setEditing(blank)}>
            <Plus size={16} /> {t("Add product")}
          </button>
        }>
        {t("Product Management")}
      </Title>
      <TableShell
        head={[
          "Product",
          "Category",
          "Type",
          "Price",
          "Stock / Quota",
          "Active",
          "",
        ]}
        empty={data?.length ? null : t("No products yet.")}>
        {(data || []).map((p) => (
          <tr key={p._id}>
            <td>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded">
                  <ProductImage product={p} />
                </div>
                <span className="max-w-48 font-semibold">{p.name}</span>
              </div>
            </td>
            <td className="text-sm">{t(p.category)}</td>
            <td>
              <span
                className={`badge badge-sm border-0 ${p.saleType === "preorder" ? "bg-secondary text-secondary-content" : "bg-primary text-primary-content"}`}>
                {p.saleType === "preorder" ? t("Pre-order") : t("In-stock")}
              </span>
            </td>
            <td>
              {taka(p.price)}/{t(p.unit)}
            </td>
            <td>
              {p.saleType === "instock"
                ? p.stock
                : `${p.preorderBooked}/${p.preorderQuota}`}
            </td>
            <td>
              <input
                type="checkbox"
                className="toggle toggle-sm toggle-primary"
                checked={p.isActive}
                onChange={() => toggle(p._id)}
                aria-label={t("Active")}
              />
            </td>
            <td className="whitespace-nowrap">
              <button
                className="btn btn-ghost btn-xs"
                aria-label={t("Edit")}
                onClick={() => setEditing(p)}>
                <Pencil size={15} />
              </button>
              <button
                className="btn btn-ghost btn-xs text-error"
                aria-label={t("Delete")}
                onClick={() => remove(p)}>
                <Trash2 size={15} />
              </button>
            </td>
          </tr>
        ))}
      </TableShell>
      {editing && (
        <ProductForm
          key={editing._id || "new"}
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            mutate();
          }}
        />
      )}
    </>
  );
}
