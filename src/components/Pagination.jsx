"use client";
import { t } from "@/lib/i18n";
export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="join mt-8 flex justify-center">
      <button
        className="btn join-item btn-sm"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}>
        {t("Prev")}
      </button>
      {Array.from({ length: pages }).map((_, i) => (
        <button
          key={i}
          className={`btn join-item btn-sm ${page === i + 1 ? "btn-brand" : ""}`}
          onClick={() => onChange(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button
        className="btn join-item btn-sm"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}>
        {t("Next")}
      </button>
    </div>
  );
}
