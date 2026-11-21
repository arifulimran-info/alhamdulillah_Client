"use client";
import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading, Title } from "@/components/dashboard/ui";
import { api } from "@/lib/api";
import { useApi, useAuth } from "@/lib/hooks";
import { uploadToImgBB } from "@/lib/imgbb";
import { DIVISIONS, PHONE_RE, cleanPhone } from "@/lib/utils";

export default function Profile() {
  const { refetch } = useAuth();
  const { data, isLoading, mutate } = useApi("/users/me", true);
  const [f, setF] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setF({ name: data.name || "", phone: data.phone || "", image: data.image || "", division: data.address?.division || "Dhaka", district: data.address?.district || "", details: data.address?.details || "" });
  }, [data]);

  if (isLoading || !f) return <Loading />;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function pickImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const tid = toast.loading(t("Uploading photo..."));
    try { setF({ ...f, image: await uploadToImgBB(file) }); toast.success(t("Photo uploaded. Save to apply."), { id: tid }); }
    catch (err) { toast.error(err.message, { id: tid }); }
  }
  async function save(e) {
    e.preventDefault();
    if (!f.name.trim()) return toast.error(t("Name is required"));
    if (!PHONE_RE.test(cleanPhone(f.phone))) return toast.error(t("Enter a valid Bangladeshi phone number"));
    setBusy(true);
    try {
      await api("/users/me", { method: "PATCH", auth: true, body: { name: f.name, phone: f.phone, image: f.image, address: { division: f.division, district: f.district, details: f.details } } });
      await mutate(); refetch();
      toast.success(t("Profile updated"));
    } catch (err) { toast.error(err.message); }
    setBusy(false);
  }
  return (
    <>
      <Title>{t("Update Profile")}</Title>
      <form onSubmit={save} className="grid max-w-2xl gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="avatar placeholder"><div className="w-16 rounded-full bg-primary text-primary-content text-xl">{f.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={f.image} alt="" /> : f.name[0]?.toUpperCase()}</div></div>
          <input type="file" accept="image/*" className="file-input file-input-sm" onChange={pickImage} />
        </div>
        <input className="input w-full" placeholder={t("Full name")} value={f.name} onChange={set("name")} />
        <input className="input w-full" placeholder={t("Phone")} value={f.phone} onChange={set("phone")} />
        <select className="select w-full" value={f.division} onChange={set("division")}>{DIVISIONS.map((d) => <option key={d}>{d}</option>)}</select>
        <input className="input w-full" placeholder={t("District")} value={f.district} onChange={set("district")} />
        <textarea className="textarea w-full sm:col-span-2" rows={3} placeholder={t("Delivery address details")} value={f.details} onChange={set("details")} />
        <button disabled={busy} className="btn btn-brand sm:col-span-2">{busy ? t("Saving...") : t("Save changes")}</button>
      </form>
    </>
  );
}
