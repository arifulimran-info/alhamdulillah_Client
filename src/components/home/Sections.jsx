"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { ProductGridSkeleton } from "@/components/Skeletons";
import ProductGrid from "@/components/ProductGrid";
import { useApi } from "@/lib/hooks";
import { CATEGORIES } from "@/lib/utils";

export function SectionHead({ title, sub, href, cta }) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{t(title)}</h2>
        {sub && <p className="section-sub mt-2">{t(sub)}</p>}
      </div>
      {href && (
        <Link href={href} className="btn btn-outline btn-sm shrink-0">
          {t(cta)}
        </Link>
      )}
    </div>
  );
}

export function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14">
      <SectionHead title={t("Shop by category")} />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="flex h-40 flex-col items-center justify-center rounded-box border border-base-300 p-3 text-center transition hover:border-primary"
            style={{ background: `${c.tint}22` }}>
            <span className="text-4xl">{c.emoji}</span>
            <span className="mt-2 font-semibold leading-tight">
              {t(c.name)}
            </span>
            <span className="mt-1 text-xs text-base-content/60">
              {t(c.note)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function Featured() {
  const { data, isLoading } = useApi("/products/featured");
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <SectionHead
        title={t("Ready to ship")}
        sub={t("Fresh stock, delivered in 2 to 4 days.")}
        href="/shop?saleType=instock"
        cta="View all"
      />
      {isLoading ? <ProductGridSkeleton /> : <ProductGrid items={data || []} />}
    </section>
  );
}

export function PreorderSection() {
  const { data, isLoading } = useApi("/products/preorders");
  return (
    <section className="mt-16 bg-base-200 py-14">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHead
          title={t("Pre-order the harvest")}
          sub={t(
            "Seasonal products, booked ahead. Pay an advance now, the rest on delivery.",
          )}
          href="/pre-order"
          cta="All pre-orders"
        />
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <ProductGrid items={(data || []).slice(0, 4)} />
        )}
      </div>
    </section>
  );
}

const why = [
  [
    "🧪",
    "Checked for purity",
    "Honey and ghee are tested or verified at the source.",
  ],
  ["🚜", "Direct from farms", "We name the farm or collector on each product."],
  ["🚚", "Home delivery", "Across Bangladesh. ৳60 in Dhaka, ৳120 elsewhere."],
  [
    "🔁",
    "Easy refund and exchange",
    "Tell us within 48 hours if something is wrong.",
  ],
];
export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <SectionHead title={t("Why AgroBazar")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {why.map(([e, ti, d]) => (
          <div key={ti} className="rounded-box border border-base-300 p-5">
            <span className="text-3xl">{e}</span>
            <h3 className="mt-3 font-heading text-lg font-semibold">{t(ti)}</h3>
            <p className="mt-1 text-sm text-base-content/70">{t(d)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const steps = [
  [
    "Pick a harvest",
    "Choose a pre-order product and see its expected delivery date.",
  ],
  [
    "Pay the advance",
    "Pay the advance percentage online to book your share of the quota.",
  ],
  ["We prepare it", "We collect or mill your product as the harvest comes in."],
  [
    "Receive and pay the rest",
    "Get it at home and pay the remaining amount on delivery.",
  ],
];
export function HowPreorder() {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16">
      <SectionHead title={t("How pre-ordering works")} />
      <ol className="steps steps-vertical w-full md:steps-horizontal">
        {steps.map(([ti, d]) => (
          <li key={ti} className="step step-primary">
            <span className="max-w-44 px-2 text-left md:text-center">
              <b className="block">{t(ti)}</b>
              <span className="text-sm text-base-content/70">{t(d)}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

const reviews = [
  [
    "Farhana R.",
    "Dhaka",
    "The Sundarban honey crystallised naturally, exactly how real honey behaves. Ordered again.",
  ],
  [
    "Mahbub A.",
    "Chattogram",
    "Pre-ordered the jhola gur in November and it arrived right on the date they promised.",
  ],
  [
    "Nusrat J.",
    "Rajshahi",
    "Their mustard oil has the real sharp smell I grew up with.",
  ],
];
const faqs = [
  [
    "Do I have to pay the full amount for a pre-order?",
    "No. You pay the advance shown on the product (for example 30%) and the rest when it is delivered.",
  ],
  [
    "Can I mix in-stock and pre-order items?",
    "Yes. We split them into two orders so each ships on its own date.",
  ],
  [
    "What if the pre-order quota is full?",
    "The button changes to Pre-order Closed. New quota is announced on this page.",
  ],
];
export function Social() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 pt-16 lg:grid-cols-2">
      <div>
        <SectionHead title={t("What customers say")} />
        <div className="space-y-3">
          {reviews.map(([n, c, ti]) => (
            <figure key={n} className="rounded-box border border-base-300 p-4">
              <blockquote className="text-base-content/85">{t(ti)}</blockquote>
              <figcaption className="mt-2 text-sm font-semibold">
                {n},{" "}
                <span className="font-normal text-base-content/60">{c}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div>
        <SectionHead title={t("Quick answers")} />
        <div className="space-y-2">
          {faqs.map(([q, a], i) => (
            <div
              key={q}
              className="collapse collapse-arrow border border-base-300">
              <input type="radio" name="home-faq" defaultChecked={i === 0} />
              <div className="collapse-title font-semibold">{t(q)}</div>
              <div className="collapse-content text-base-content/75">
                <p>{t(a)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
