"use client";
import { useLang } from "@/lib/i18n";

export default function StaticPage({ page }) {
  const lang = useLang((s) => s.lang);
  const { title, intro, sections = [] } = page[lang] || page.en;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="section-title">{title}</h1>
      {intro && <p className="section-sub mt-3">{intro}</p>}
      <div className="mt-8 space-y-6">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-heading text-xl font-semibold text-primary">{s.h}</h2>
            <p className="mt-2 leading-relaxed text-base-content/80">{s.p}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
