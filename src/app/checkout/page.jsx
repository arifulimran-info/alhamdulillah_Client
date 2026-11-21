"use client";
import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth, useHydrated } from "@/lib/hooks";
import { useCart } from "@/lib/stores";
import { DIVISIONS, PHONE_RE, cleanPhone, taka } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useHydrated();
  const { user, isPending } = useAuth();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [f, setF] = useState({
    name: "",
    phone: "",
    division: "Dhaka",
    district: "Dhaka",
    details: "",
    method: "cod",
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && !user) router.replace(`/sign-in?redirect=${pathname}`);
  }, [isPending, user, router, pathname]);

  useEffect(() => {
    if (!user) return;
    api("/users/me", { auth: true })
      .then((u) =>
        setF((x) => ({
          ...x,
          name: u.name || "",
          phone: u.phone || "",
          division: u.address?.division || x.division,
          district: u.address?.district || x.district,
          details: u.address?.details || "",
        })),
      )
      .catch(() => {});
  }, [user]);

  if (!hydrated || isPending || !user)
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="skeleton h-64 w-full" />
      </div>
    );
  if (user.role === "admin")
    return (
      <p className="py-20 text-center">
        {t("Admins cannot place orders. Sign in with a customer account.")}
      </p>
    );
  if (!items.length)
    return (
      <div className="py-20 text-center">
        <p>{t("Your cart is empty.")}</p>
        <Link href="/shop" className="btn btn-brand mt-4">
          {t("Shop now")}
        </Link>
      </div>
    );

  const stockItems = items.filter((i) => i.saleType === "instock");
  const preItems = items.filter((i) => i.saleType === "preorder");
  const sum = (a) => a.reduce((n, i) => n + i.price * i.quantity, 0);
  const delivery = f.district.trim().toLowerCase() === "dhaka" ? 60 : 120;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) return toast.error(t("Please enter your name"));
    if (!PHONE_RE.test(cleanPhone(f.phone)))
      return toast.error(
        t("Enter a valid Bangladeshi phone number, like 01712345678"),
      );
    if (!f.district.trim() || !f.details.trim())
      return toast.error(t("Please complete your delivery address"));
    setBusy(true);
    try {
      const { orders } = await api("/orders/checkout", {
        method: "POST",
        auth: true,
        body: {
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          paymentMethod: f.method,
          shippingInfo: {
            name: f.name,
            phone: f.phone,
            address: {
              division: f.division,
              district: f.district,
              details: f.details,
            },
          },
        },
      });
      clear();
      const first = orders.find((o) => o.payNow);
      if (first) {
        toast.success(
          t("Order {no} placed. Redirecting to payment...", {
            no: first.orderNumber,
          }),
        );
        if (orders.filter((o) => o.payNow).length > 1)
          toast(t("Your second order can be paid from My Orders."));
        router.push(`/pay/${first._id}`);
      } else {
        toast.success(
          t("Order {no} placed. Pay cash on delivery.", {
            no: orders[0].orderNumber,
          }),
        );
        router.push("/dashboard/customer/my-orders");
      }
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        <h1 className="section-title">{t("Checkout")}</h1>
        <fieldset className="grid gap-3 rounded-box border border-base-300 p-5 sm:grid-cols-2">
          <legend className="px-2 font-semibold">
            {t("Delivery details")}
          </legend>
          <input
            className="input w-full"
            placeholder={t("Full name")}
            value={f.name}
            onChange={set("name")}
          />
          <input
            className="input w-full"
            placeholder={t("Phone (01XXXXXXXXX)")}
            inputMode="tel"
            value={f.phone}
            onChange={set("phone")}
          />
          <select
            className="select w-full"
            value={f.division}
            onChange={set("division")}>
            {DIVISIONS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
          <input
            className="input w-full"
            placeholder={t("District")}
            value={f.district}
            onChange={set("district")}
          />
          <textarea
            className="textarea w-full sm:col-span-2"
            rows={3}
            placeholder={t("House, road, area")}
            value={f.details}
            onChange={set("details")}
          />
        </fieldset>
        {stockItems.length > 0 && (
          <fieldset className="rounded-box border border-base-300 p-5">
            <legend className="px-2 font-semibold">
              {t("Payment for in-stock items")}
            </legend>
            <label className="flex cursor-pointer items-center gap-3 py-1">
              <input
                type="radio"
                className="radio radio-primary"
                checked={f.method === "cod"}
                onChange={() => setF({ ...f, method: "cod" })}
              />{" "}
              {t("Cash on Delivery")}
            </label>
            <label className="flex cursor-pointer items-center gap-3 py-1">
              <input
                type="radio"
                className="radio radio-primary"
                checked={f.method === "online"}
                onChange={() => setF({ ...f, method: "online" })}
              />{" "}
              {t("Pay online (card)")}
            </label>
          </fieldset>
        )}
      </div>
      <aside className="h-fit space-y-4 rounded-box border border-base-300 p-5 lg:sticky lg:top-24">
        <h2 className="font-heading text-xl font-semibold">
          {t("Order summary")}
        </h2>
        {stockItems.length > 0 && (
          <div className="text-sm">
            <b>{t("In-stock order")}</b>
            <p className="flex justify-between">
              <span>{t("Items")}</span>
              <span>{taka(sum(stockItems))}</span>
            </p>
            <p className="flex justify-between">
              <span>{t("Delivery")}</span>
              <span>{taka(delivery)}</span>
            </p>
            <p className="flex justify-between font-semibold">
              <span>{t("Total")}</span>
              <span>{taka(sum(stockItems) + delivery)}</span>
            </p>
          </div>
        )}
        {preItems.length > 0 &&
          (() => {
            const adv = Math.round(
              preItems.reduce((n, i) => n + i.price * i.quantity * 0.3, 0),
            );
            return (
              <div className="text-sm">
                <b>{t("Pre-order")}</b>
                <p className="flex justify-between">
                  <span>{t("Items")}</span>
                  <span>{taka(sum(preItems))}</span>
                </p>
                <p className="flex justify-between">
                  <span>{t("Delivery (paid on arrival)")}</span>
                  <span>{taka(delivery)}</span>
                </p>
                <p className="text-xs text-base-content/60">
                  {t(
                    "You pay only the advance online now. The exact advance (about 25 to 30%, about {adv}) is calculated by our server, and the rest is paid on delivery.",
                    { adv: taka(adv) },
                  )}
                </p>
              </div>
            );
          })()}
        <button disabled={busy} className="btn btn-brand w-full">
          {busy ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            t("Place order")
          )}
        </button>
      </aside>
    </form>
  );
}
