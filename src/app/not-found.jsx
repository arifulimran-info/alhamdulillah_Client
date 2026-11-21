"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="font-heading text-7xl font-bold text-secondary">404</p>
      <h1 className="mt-3 text-2xl font-semibold">{t("This page has gone to harvest")}</h1>
      <p className="mt-2 text-base-content/70">{t("The link may be old or mistyped.")}</p>
      <Link href="/" className="btn btn-brand mt-6">{t("Back to Home")}</Link>
    </div>
  );
}
