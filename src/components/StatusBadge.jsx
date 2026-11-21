"use client";
import { t } from "@/lib/i18n";
import { STATUS_STYLE } from "@/lib/utils";
export default function StatusBadge({ status }) {
  return <span className={`badge badge-sm capitalize ${STATUS_STYLE[status] || "badge-ghost"}`}>{t(status)}</span>;
}
