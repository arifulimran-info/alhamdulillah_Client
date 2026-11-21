"use client";
import { t } from "@/lib/i18n";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  ClipboardList,
  CreditCard,
  Heart,
  LayoutDashboard,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Sprout,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { PageSkeleton } from "@/components/Skeletons";
import { useAuth } from "@/lib/hooks";

const customerLinks = [
  ["/dashboard/customer", "Overview", LayoutDashboard],
  ["/dashboard/customer/my-orders", "My Orders", ClipboardList],
  ["/dashboard/customer/pre-orders", "My Pre-orders", Sprout],
  ["/dashboard/customer/payments", "Payment History", CreditCard],
  ["/dashboard/customer/wishlist", "Wishlist", Heart],
  ["/dashboard/profile", "Update Profile", UserCog],
];
const adminLinks = [
  ["/dashboard/admin", "Overview", BarChart3],
  ["/dashboard/admin/products", "Products", Package],
  ["/dashboard/admin/orders", "Orders", ClipboardList],
  ["/dashboard/admin/preorders", "Pre-orders", Sprout],
  ["/dashboard/admin/users", "Users", Users],
  ["/dashboard/admin/transactions", "Transactions", Wallet],
  ["/dashboard/profile", "Update Profile", UserCog],
];

export default function DashboardLayout({ children }) {
  const { user, isPending } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const role = user?.role || "customer";

  // Wait for the session before deciding anything, so a reload never bounces a signed-in user.
  useEffect(() => {
    if (isPending) return;
    if (!user) router.replace(`/sign-in?redirect=${pathname}`);
    else if (pathname.startsWith("/dashboard/admin") && role !== "admin")
      router.replace("/dashboard/customer");
    else if (pathname.startsWith("/dashboard/customer") && role === "admin")
      router.replace("/dashboard/admin");
  }, [isPending, user, role, pathname, router]);

  if (isPending || !user) return <PageSkeleton />;
  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside
        className={`no-print sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 flex-col border-r border-base-300 bg-base-200 transition-all md:flex ${collapsed ? "w-16" : "w-60"}`}>
        <button
          className="btn btn-ghost btn-sm m-2 self-end"
          aria-label={t("Collapse sidebar")}
          onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
        <nav className="flex-1 space-y-1 px-2">
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              title={t(label)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${pathname === href ? "bg-primary text-primary-content" : "hover:bg-base-300"}`}>
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span>{t(label)}</span>}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="no-print flex items-center justify-between border-b border-base-300 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="w-9 rounded-full bg-primary text-primary-content">
                {user.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */ <img
                    src={user.image}
                    alt=""
                  />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </div>
            </div>
            <div className="leading-tight">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-base-content/60">
                {user.email} - <span className="capitalize">{t(role)}</span>
              </p>
            </div>
          </div>
        </div>
        <nav className="no-print flex gap-1 overflow-x-auto border-b border-base-300 p-2 md:hidden">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`btn btn-xs whitespace-nowrap ${pathname === href ? "btn-brand" : "btn-ghost"}`}>
              {t(label)}
            </Link>
          ))}
        </nav>
        <div className="p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
