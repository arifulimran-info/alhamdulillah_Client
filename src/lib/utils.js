import { isBn } from "@/lib/i18n";

export const CATEGORIES = [
  { name: "Pure Honey", slug: "pure-honey", emoji: "🍯", tint: "#e8b84a", note: "Wild and flower honey" },
  { name: "Ghee & Oils", slug: "ghee-oils", emoji: "🫒", tint: "#d9c26a", note: "Cold-pressed and slow-simmered" },
  { name: "Khejurer Gur", slug: "khejurer-gur", emoji: "🌴", tint: "#a8693a", note: "Winter date palm jaggery" },
  { name: "Rice, Flour & Lentils", slug: "rice-flour-lentils", emoji: "🌾", tint: "#c8b27a", note: "New-crop grains and dals" },
  { name: "Spices & Seeds", slug: "spices-seeds", emoji: "🌶️", tint: "#b4472f", note: "Stone-ground and sun-dried" },
];
export const categoryByName = (n) => CATEGORIES.find((c) => c.name === n) || CATEGORIES[0];
export const categoryBySlug = (s) => CATEGORIES.find((c) => c.slug === s);

export const DIVISIONS = ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet", "Rangpur", "Mymensingh"];
export const PHONE_RE = /^(?:\+?88)?01[3-9]\d{8}$/;
export const cleanPhone = (p) => String(p || "").replace(/[\s-]/g, "");

export const taka = (n) => `৳${Number(n || 0).toLocaleString(isBn() ? "bn-BD" : "en-US")}`;
export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString(isBn() ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) : "-";

export const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
export const STATUS_STYLE = {
  pending: "badge-warning", confirmed: "badge-info", processing: "badge-info",
  shipped: "badge-secondary", delivered: "badge-success", cancelled: "badge-error",
};

// How many units can still be bought for a product
export const maxQty = (p) =>
  p.saleType === "instock" ? Math.max(0, p.stock ?? 0) : Math.max(0, (p.preorderQuota ?? 0) - (p.preorderBooked ?? 0));
