"use client";
import { t } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  function submit(e) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      e.target.reset();
      toast.success(t("Message sent. We will reply within a day."));
    }, 600);
  }
  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 md:grid-cols-2">
      <div>
        <h1 className="section-title">{t("Contact Us")}</h1>
        <p className="section-sub mt-3">
          {t(
            "Questions about an order, a harvest date or wholesale? We read every message.",
          )}
        </p>
        <ul className="mt-6 space-y-2 text-base-content/80">
          <li>alhamdulillahagro.2027@gmail.com</li>
          <li>+880 1715-818969 (10am to 10pm)</li>
          <li>{t(Bansbari, 7th Word, Ranisankail Pourashava, Ranisankail, Thakurgaon)}</li>
        </ul>
      </div>
      <form
        onSubmit={submit}
        className="space-y-3 rounded-box border border-base-300 p-5">
        <input required className="input w-full" placeholder={t("Your name")} />
        <input
          required
          type="email"
          className="input w-full"
          placeholder={t("Email")}
        />
        <textarea
          required
          rows={4}
          className="textarea w-full"
          placeholder={t("How can we help?")}
        />
        <button disabled={sending} className="btn btn-brand w-full">
          {sending ? t("Sending...") : t("Send message")}
        </button>
      </form>
    </div>
  );
}
