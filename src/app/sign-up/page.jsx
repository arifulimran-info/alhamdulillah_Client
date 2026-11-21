"use client";
import { t } from "@/lib/i18n";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { PHONE_RE, cleanPhone } from "@/lib/utils";

export default function SignUp() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    if (!f.name.trim()) return toast.error(t("Enter your full name"));
    if (!/^\S+@\S+\.\S+$/.test(f.email))
      return toast.error(t("Enter a valid email address"));
    if (!PHONE_RE.test(cleanPhone(f.phone)))
      return toast.error(
        t("Enter a valid Bangladeshi phone number, like 01712345678"),
      );
    if (f.password.length < 6)
      return toast.error(t("Password must be at least 6 characters"));
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: f.name.trim(),
      email: f.email,
      password: f.password,
      phone: cleanPhone(f.phone),
    });
    if (error) {
      toast.error(t(error.message || "Could not create the account"));
      return setBusy(false);
    }
    clearToken();
    toast.success(t("Account created"));
    router.push("/dashboard");
    router.refresh();
  }
  return (
    <form
      onSubmit={submit}
      className="mx-auto my-14 w-full max-w-sm space-y-3 rounded-box border border-base-300 p-6">
      <h1 className="section-title">{t("Create account")}</h1>
      <input
        className="input w-full"
        placeholder={t("Full name")}
        value={f.name}
        onChange={set("name")}
        autoComplete="name"
      />
      <input
        className="input w-full"
        type="email"
        placeholder={t("Email")}
        value={f.email}
        onChange={set("email")}
        autoComplete="email"
      />
      <input
        className="input w-full"
        inputMode="tel"
        placeholder={t("Phone (01XXXXXXXXX)")}
        value={f.phone}
        onChange={set("phone")}
        autoComplete="tel"
      />
      <input
        className="input w-full"
        type="password"
        placeholder={t("Password (6+ characters)")}
        value={f.password}
        onChange={set("password")}
        autoComplete="new-password"
      />
      <button disabled={busy} className="btn btn-brand w-full">
        {busy ? t("Creating...") : t("Sign up")}
      </button>
      <p className="text-center text-sm">
        {t("Already registered?")}{" "}
        <Link className="link link-primary" href="/sign-in">
          {t("Sign in")}
        </Link>
      </p>
    </form>
  );
}
