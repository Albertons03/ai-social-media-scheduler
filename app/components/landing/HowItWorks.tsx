import { ListOrdered } from "lucide-react";
import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function HowItWorks({ locale }: Props) {
  const t = translations[locale].howItWorks

  const steps = [
    { title: t.step1Title, description: t.step1Description },
    { title: t.step2Title, description: t.step2Description },
    { title: t.step3Title, description: t.step3Description },
  ];

  return (
    <section className="py-24 bg-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-metric-yellow/10 border border-metric-yellow/20 rounded-full mb-6">
          <ListOrdered className="text-metric-yellow" size={16} />
          <span className="text-metric-yellow text-sm font-medium">
            {t.badge}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          {t.heading}
        </h2>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white/[0.02] backdrop-blur-lg border border-white/[0.06] rounded-3xl p-8 hover:bg-white/[0.06] transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm mb-6">
                {index + 1}
              </div>
              <h3 className="text-white text-xl font-semibold mb-3">
                {step.title}
              </h3>
              <p className="text-slate-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
