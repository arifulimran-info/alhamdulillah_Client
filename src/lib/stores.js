"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { maxQty } from "@/lib/utils";

const snapshot = (p) => ({
  productId: p._id, slug: p.slug, name: p.name, nameBn: p.nameBn || "", price: p.price, unit: p.unit, image: p.image || "",
  category: p.category, saleType: p.saleType, max: maxQty(p),
});

// Cart persists in localStorage so a reload never loses it.
export const useCart = create(
  persist(
    (set) => ({
      items: [],
      add: (p, qty = 1) =>
        set((s) => {
          const max = maxQty(p);
          const found = s.items.find((i) => i.productId === p._id);
          if (found) return { items: s.items.map((i) => (i.productId === p._id ? { ...i, ...snapshot(p), quantity: Math.min(max, i.quantity + qty) } : i)) };
          return { items: [...s.items, { ...snapshot(p), quantity: Math.min(max, qty) }] };
        }),
      setQty: (id, q) => set((s) => ({ items: s.items.map((i) => (i.productId === id ? { ...i, quantity: Math.max(1, Math.min(i.max, q)) } : i)) })),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.productId !== id) })),
      clear: () => set({ items: [] }),
      // refresh price / stock from the server; drop products that no longer exist
      sync: (products) =>
        set((s) => ({
          items: s.items
            .map((i) => {
              const p = products.find((x) => x._id === i.productId);
              if (!p || !p.isActive) return null;
              const snap = snapshot(p);
              return { ...i, ...snap, quantity: Math.max(1, Math.min(snap.max || 1, i.quantity)) };
            })
            .filter(Boolean),
        })),
    }),
    { name: "agrobazar-cart" }
  )
);

export const useWishlist = create(
  persist(
    (set, get) => ({
      items: [],
      has: (id) => get().items.some((i) => i._id === id),
      toggle: (p) =>
        set((s) => ({ items: s.items.some((i) => i._id === p._id) ? s.items.filter((i) => i._id !== p._id) : [...s.items, p] })),
    }),
    { name: "agrobazar-wishlist" }
  )
);
