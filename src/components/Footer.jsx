"use client";
import { t } from "@/lib/i18n";
import Link from "next/link";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Logo } from "@/components/Navbar";
import { CATEGORIES } from "@/lib/utils";

const XLogo = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const help = [
  ["/faq", "FAQ"],
  ["/refund-policy", "Refund Policy"],
  ["/exchange-policy", "Exchange Policy"],
  ["/privacy-policy", "Privacy Policy"],
  ["/terms-and-conditions", "Terms & Conditions"],
  ["/track-order", "Track Order"],
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-neutral text-neutral-content">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm opacity-80">
            {t(
              "Honey, ghee, gur and grains from farms we know by name, delivered to your door.",
            )}
          </p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              aria-label="Facebook"
              className="btn btn-circle btn-sm btn-ghost">
              <Facebook size={18} />
            </a>
            <a
              href="https://youtube.com"
              aria-label="YouTube"
              className="btn btn-circle btn-sm btn-ghost">
              <Youtube size={18} />
            </a>
            <a
              href="https://x.com"
              aria-label="X"
              className="btn btn-circle btn-sm btn-ghost">
              <XLogo />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">
            {t("Categories")}
          </h3>
          <ul className="space-y-2 text-sm opacity-85">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link className="hover:underline" href={`/category/${c.slug}`}>
                  {t(c.name)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">
            {t("Help")}
          </h3>
          <ul className="space-y-2 text-sm opacity-85">
            {help.map(([h, l]) => (
              <li key={h}>
                <Link className="hover:underline" href={h}>
                  {t(l)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-heading text-lg font-semibold">
            {t("Contact")}
          </h3>
          <ul className="space-y-2 text-sm opacity-85">
            <li className="flex gap-2">
              <Mail size={16} /> alhamdilillahagro.2027@gmail.com
            </li>
            <li className="flex gap-2">
              <Phone size={16} /> +880 1715-818969, +8801717242555
            </li>
            <li className="flex gap-2">
              <MapPin size={16} /> {t("Banshbari, Ranisankail, Thakurgaon")}
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs opacity-70">
        © {new Date().getFullYear()} Alhamdulillah Agro.{" "}
        {t("All rights reserved.")}
      </p>
    </footer>
  );
}
