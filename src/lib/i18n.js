"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { bn } from "@/lib/dict-bn";

// Language is stored in localStorage. skipHydration + manual rehydrate (see LangRoot)
// keeps the first client render identical to the server HTML.
export const useLang = create(
  persist((set) => ({ lang: "en", setLang: (lang) => set({ lang }) }), { name: "agro-lang", skipHydration: true })
);

// Plain function (not a hook). LangRoot remounts the tree when the language changes,
// so every component re-runs t() with the new language.
export function t(text, vars) {
  if (typeof text !== "string") return text;
  let out = useLang.getState().lang === "bn" ? bn[text] ?? text : text;
  if (vars) out = out.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
  return out;
}
export const isBn = () => useLang.getState().lang === "bn";

// Product fields: use the Bengali name / description when the admin provided them.
export const pname = (p) => (isBn() && p?.nameBn) || p?.name;
export const pdesc = (p) => (isBn() && p?.descriptionBn) || p?.description;
