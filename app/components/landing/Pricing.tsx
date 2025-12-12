"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, DollarSign } from "lucide-react";
import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function Pricing({ locale }: Props) {
  const [isAnnual, setIsAnnual] = useState(true);
  const t = translations[locale].pricing

  const tiers = [
    {
      name: t.tier1Name,
      price: { monthly: 0, annual: 0 },
      description: t.tier1Description,
      features: [
        t.tier1Feature1,
        t.tier1Feature2,
        t.tier1Feature3,
        t.tier1Feature4,
        t.tier1Feature5,
      ],
      cta: t.tier1CTA,
      highlighted: false,
    },
    {
      name: t.tier2Name,
      price: { monthly: 29, annual: 24 },
      description: t.tier2Description,
      features: [
        t.tier2Feature1,
        t.tier2Feature2,
        t.tier2Feature3,
        t.tier2Feature4,
        t.tier2Feature5,
        t.tier2Feature6,
      ],
      cta: t.tier2CTA,
      highlighted: true,
      badge: t.tier2Badge,
    },
    {
      name: t.tier3Name,
      price: { monthly: 99, annual: 79 },
      description: t.tier3Description,
      features: [
        t.tier3Feature1,
        t.tier3Feature2,
        t.tier3Feature3,
        t.tier3Feature4,
        t.tier3Feature5,
        t.tier3Feature6,
      ],
      cta: t.tier3CTA,
      highlighted: false,
    },
  ];

  return (
    <section className="py-24 bg-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full mb-6">
          <DollarSign className="text-secondary" size={16} />
          <span className="text-secondary text-sm font-medium">{t.badge}</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
          {t.heading}
        </h2>

        {/* Annual toggle */}
        <div className="flex items-center justify-center gap-3 mb-16">
          <span
            className={`text-sm ${
              !isAnnual ? "text-white font-medium" : "text-slate-400"
            }`}
          >
            {t.toggleMonthly}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full transition-colors"
            style={{ backgroundColor: isAnnual ? "#06B6D4" : "#334155" }}
          >
            <div
              className="absolute top-1 w-5 h-5 bg-white rounded-full transition-all"
              style={{ left: isAnnual ? "32px" : "4px" }}
            />
          </button>
          <span
            className={`text-sm ${
              isAnnual ? "text-white font-medium" : "text-slate-400"
            }`}
          >
            {t.toggleYearly}
          </span>
          {isAnnual && (
            <span className="px-3 py-1 bg-metric-green/20 text-metric-green text-sm font-medium rounded-full">
              {t.saveText}
            </span>
          )}
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative rounded-3xl p-8 transition-all ${
                tier.highlighted
                  ? "bg-gradient-to-b from-primary-light/10 to-secondary/10 backdrop-blur-lg border-2 border-primary-light/50 md:scale-105 shadow-2xl shadow-primary-light/20"
                  : "bg-white/[0.03] backdrop-blur-lg border border-white/[0.08] hover:bg-white/[0.08]"
              }`}
            >
              {/* Best Seller badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-light/80 to-secondary/80 text-white text-xs font-bold rounded-full shadow-lg">
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <div
                className={`text-sm mb-2 ${
                  tier.highlighted ? "text-primary-light" : "text-slate-400"
                }`}
              >
                {tier.name}
              </div>

              {/* Price */}
              <div className="text-4xl font-bold text-white mb-1">
                {tier.price.monthly === 0 ? (
                  t.tier1Price
                ) : (
                  <>
                    ${isAnnual ? tier.price.annual : tier.price.monthly}
                    <span className="text-lg text-slate-400">{t.priceMonth}</span>
                  </>
                )}
              </div>

              <div className="text-slate-400 mb-8">{tier.description}</div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`flex items-start gap-2 ${
                      tier.highlighted ? "text-white" : "text-slate-300"
                    }`}
                  >
                    <Check
                      className={`flex-shrink-0 mt-0.5 ${
                        tier.highlighted
                          ? "text-primary-light"
                          : "text-metric-green"
                      }`}
                      size={18}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {index === 2 ? (
                <button
                  className={`w-full py-3 font-semibold rounded-full transition-all ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-primary-light/90 to-secondary/90 hover:from-primary-light hover:to-secondary text-white shadow-lg"
                      : "bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] text-white"
                  }`}
                >
                  {tier.cta}
                  {tier.highlighted && " →"}
                </button>
              ) : (
                <Link
                  href="/signup"
                  className={`block w-full py-3 font-semibold rounded-full transition-all text-center ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-primary-light/90 to-secondary/90 hover:from-primary-light hover:to-secondary text-white shadow-lg"
                      : "bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] text-white"
                  }`}
                >
                  {tier.cta}
                  {tier.highlighted && " →"}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
