"use client";
import { t } from "@/lib/i18n";
import { MessageCircle, Phone } from "lucide-react";

export default function FloatingContact() {
  const wa = process.env.NEXT_PUBLIC_WHATSAPP || "8801700000000";
  return (
    <div className="no-print fixed bottom-4 right-4 z-30 flex flex-col gap-2">
      <a
        href={`tel:+${wa}`}
        aria-label={t("Call us")}
        className="btn btn-circle btn-secondary shadow-lg">
        <Phone size={20} />
      </a>
      <a
        href={`https://wa.me/${wa}`}
        target="_blank"
        rel="noreferrer"
        aria-label={t("Chat on WhatsApp")}
        className="btn btn-circle border-0 bg-[#25D366] text-white shadow-lg">
        <MessageCircle size={22} />
      </a>
    </div>
  );
}
