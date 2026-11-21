"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
export default function Error({ reset }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">{t("Something went wrong")}</h1>
      <p className="mt-2 text-base-content/70">{t("Please try again. If it keeps happening, contact us.")}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button onClick={reset} className="btn btn-brand">{t("Try again")}</button>
        <Link href="/" className="btn btn-outline">{t("Back to Home")}</Link>
      </div>
    </div>
  );
}
