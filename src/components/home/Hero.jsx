"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  {
    emoji: "🍯",
    tag: "Raw honey",
    title: "Pure, safe farm products, straight from the farm to your home",
    sub: "Honey, ghee and spices from farms we visit ourselves.",
  },
  {
    emoji: "🌴",
    tag: "Winter pre-order",
    title: "Book this winter's nolen gur ahead of the season",
    sub: "Pay a small advance now and get the first batch of the season.",
  },
  {
    emoji: "🌾",
    tag: "New harvest",
    title: "New-crop rice, straight from the mill",
    sub: "Aman and chinigura rice milled on order, never from old stock.",
  },
];

export default function Hero() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % slides.length), 5500);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <section className="relative overflow-hidden bg-primary text-primary-content">
      <div className="field-rows absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 md:grid-cols-[1.4fr_1fr] md:py-20">
        <div key={i}>
          <span className="badge border-0 bg-secondary px-3 py-3 font-semibold text-secondary-content">
            {t(s.tag)}
          </span>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {t(s.title)}
          </h1>
          <p className="mt-4 max-w-xl text-lg opacity-90">{t(s.sub)}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-honey btn-lg">
              {t("Shop Now")}
            </Link>
            <Link
              href="/pre-order"
              className="btn btn-lg border-primary-content/50 bg-transparent text-primary-content hover:bg-primary-content/10">
              {t("Pre-order Now")}
            </Link>
          </div>
          <div className="mt-8 flex gap-2" role="tablist">
            {slides.map((_, n) => (
              <button
                key={n}
                aria-label={`${t("Slide")} ${n + 1}`}
                onClick={() => setI(n)}
                className={`h-1.5 rounded-full transition-all ${n === i ? "w-10 bg-secondary" : "w-5 bg-primary-content/40"}`}
              />
            ))}
          </div>
        </div>
        <div className="hidden justify-center md:flex">
          <div
            className="grid h-72 w-72 place-items-center rounded-full bg-secondary/90 text-[9rem] shadow-2xl"
            aria-hidden>
            {s.emoji}
          </div>
        </div>
      </div>
    </section>
  );
}
