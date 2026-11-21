"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, ShoppingBasket, Sun } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { useAuth, useHydrated } from "@/lib/hooks";
import { t, useLang } from "@/lib/i18n";
import { useCart } from "@/lib/stores";
import { taka } from "@/lib/utils";

const links = [
  ["/", "Home"], ["/shop", "Shop"], ["/pre-order", "Pre-order"], ["/our-mission", "Our Mission"], ["/contact-us", "Contact"],
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-lg text-primary-content">🌾</span>
      <span className="font-heading text-2xl font-bold tracking-tight text-primary">Alhamdulillah Agro</span>
    </Link>
  );
}

function LangToggle() {
  const lang = useLang((s) => s.lang);
  const setLang = useLang((s) => s.setLang);
  return (
    <button onClick={() => setLang(lang === "bn" ? "en" : "bn")} className="btn btn-ghost btn-sm px-2 font-semibold" aria-label={t("Toggle language")} title={t("Toggle language")}>
      {lang === "bn" ? "EN" : "বাংলা"}
    </button>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "agro-dark"), []);
  function toggle() {
    const next = dark ? "agro" : "agro-dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("agro-theme", next); } catch {}
    setDark(!dark);
  }
  return (
    <button onClick={toggle} className="btn btn-ghost btn-circle btn-sm" aria-label={t("Toggle theme")}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default function Navbar() {
  const router = useRouter();
  const { user } = useAuth();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const count = items.reduce((n, i) => n + i.quantity, 0);
  const total = items.reduce((n, i) => n + i.quantity * i.price, 0);

  async function signOut() {
    await authClient.signOut();
    clearToken();
    toast.success(t("Signed out"));
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-base-100/95 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-3">
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle" aria-label={t("Menu")}><Menu size={20} /></button>
            <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-52 rounded-box bg-base-100 p-2 shadow-lg border border-base-300">
              {links.map(([href, label]) => <li key={href}><Link href={href}>{t(label)}</Link></li>)}
            </ul>
          </div>
          <Logo />
        </div>
        <nav className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1 font-medium">
            {links.map(([href, label]) => <li key={href}><Link href={href}>{t(label)}</Link></li>)}
          </ul>
        </nav>
        <div className="navbar-end gap-1">
          <LangToggle />
          <ThemeToggle />
          <Link href="/cart" className="btn btn-ghost btn-sm gap-2" aria-label={t("Cart")}>
            <span className="indicator">
              {hydrated && count > 0 && <span className="indicator-item badge badge-secondary badge-xs">{count}</span>}
              <ShoppingBasket size={20} />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{hydrated ? taka(total) : "৳0"}</span>
          </Link>
          {user ? (
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="btn btn-ghost btn-sm gap-2 px-1">
                <span className="avatar placeholder">
                  <span className="w-8 rounded-full bg-primary text-primary-content">
                    {user.image ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={user.image} alt="" /> : user.name?.[0]?.toUpperCase()}
                  </span>
                </span>
                <span className="hidden text-left leading-tight md:block">
                  <span className="block max-w-28 truncate text-sm font-semibold">{user.name}</span>
                  <span className="badge badge-secondary badge-xs capitalize">{t(user.role || "customer")}</span>
                </span>
              </button>
              <ul tabIndex={0} className="menu dropdown-content z-50 mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                <li><Link href="/dashboard">{t("Dashboard")}</Link></li>
                <li><Link href="/dashboard/profile">{t("Update Profile")}</Link></li>
                <li><button onClick={signOut}>{t("Sign Out")}</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="btn btn-ghost btn-sm">{t("Sign In")}</Link>
              <Link href="/sign-up" className="btn btn-brand btn-sm">{t("Sign Up")}</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
