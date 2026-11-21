"use client";
import { Fragment, useEffect } from "react";
import { useLang } from "@/lib/i18n";

export default function LangRoot({ children }) {
  const lang = useLang((s) => s.lang);
  useEffect(() => { useLang.persist.rehydrate(); }, []);
  useEffect(() => { document.documentElement.lang = lang === "bn" ? "bn" : "en"; }, [lang]);
  return <Fragment key={lang}>{children}</Fragment>;
}
