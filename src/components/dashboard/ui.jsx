"use client";
import { t } from "@/lib/i18n";

export const StatCard = ({ label, value, hint }) => {
  return (
    <div className="rounded-box border border-base-300 p-4">
      <p className="text-sm text-base-content/60">{t(label)}</p>
      <p className="mt-1 font-heading text-3xl font-bold text-primary">
        {value}
      </p>
      {hint && <p className="text-xs text-base-content/50">{t(hint)}</p>}
    </div>
  );
};
export const Title = ({ children, action }) => {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="section-title">{t(children)}</h1>
      {action}
    </div>
  );
};
export const TableShell = ({ head, children, empty }) => {
  return (
    <div className="overflow-x-auto rounded-box border border-base-300">
      <table className="table">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{t(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
      {empty && (
        <p className="p-8 text-center text-base-content/60">{t(empty)}</p>
      )}
    </div>
  );
};
export const Loading = () => (
  <div className="space-y-3">
    <div className="skeleton h-12 w-full" />
    <div className="skeleton h-40 w-full" />
  </div>
);
