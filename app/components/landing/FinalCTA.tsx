"use client";

import { useState } from "react";
import Link from "next/link";
import { translations, type Locale } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";

type Props = {
  locale: Locale;
};

export default function FinalCTA({ locale }: Props) {
  const t = translations[locale].finalCTA;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "landing_final_cta" }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(data.message || t.emailSuccess);
        setEmail(""); // Clear input on success

        // Track successful email capture
        trackEvent("generate_lead", {
          source: "landing_page",
          location: "final_cta_section",
          email_domain: email.split("@")[1] || "unknown",
        });
      } else {
        setMessage(data.error || t.emailError);
      }
    } catch (error) {
      setMessage(t.emailError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 relative overflow-hidden bg-bg-dark">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 via-secondary/10 to-accent-pink/10 blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {t.heading}
        </h2>
        <p className="text-xl text-slate-300 mb-12">{t.subheading}</p>

        {/* Email Capture Form */}
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto mb-8">
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              required
              disabled={loading}
              className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-light disabled:opacity-50 text-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-4 bg-gradient-to-r from-primary-light to-secondary hover:from-cyan-400 hover:to-purple-500 text-white text-lg font-bold rounded-full shadow-2xl shadow-primary-light/30 transition-all hover:scale-105 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? t.emailLoading : t.emailCTA}
            </button>
          </div>

          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes("success") ||
                message.includes("Successfully") ||
                message.includes("Already")
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        {/* Alternative CTA Link */}
        <div className="mb-6">
          <Link
            href="/signup"
            className="text-primary-light hover:text-primary-dark underline transition-colors"
            onClick={() =>
              trackEvent("cta_click", {
                source: "landing_page",
                cta_text: t.cta,
                cta_location: "final_cta_section",
              })
            }
          >
            {t.cta}
          </Link>
        </div>

        <div className="text-slate-400 text-sm">{t.disclaimer}</div>
      </div>
    </section>
  );
}
