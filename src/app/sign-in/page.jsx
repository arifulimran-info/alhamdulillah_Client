"use client";
import { t } from "@/lib/i18n";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";

function Form() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email))
      return toast.error(t("Enter a valid email address"));
    if (!password) return toast.error(t("Enter your password"));
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    if (error) {
      toast.error(t(error.message || "Wrong email or password"));
      return setBusy(false);
    }
    clearToken();
    toast.success(t("Welcome back"));
    router.push(redirect);
    router.refresh();
  }
  return (
    <form
      onSubmit={submit}
      className="mx-auto my-14 w-full max-w-sm space-y-3 rounded-box border border-base-300 p-6">
      <h1 className="section-title">{t("Sign in")}</h1>
      <input
        className="input w-full"
        type="email"
        placeholder={t("Email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
      />
      <input
        className="input w-full"
        type="password"
        placeholder={t("Password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button disabled={busy} className="btn btn-brand w-full">
        {busy ? t("Signing in...") : t("Sign in")}
      </button>
      <p className="text-center text-sm">
        {t("New here?")}{" "}
        <Link className="link link-primary" href="/sign-up">
          {t("Create an account")}
        </Link>
      </p>
    </form>
  );
}
export default function SignIn() {
  return (
    <Suspense>
      <Form />
    </Suspense>
  );
}
