import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function Stats({ locale }: Props) {
  const t = translations[locale].stats

  const stats = [
    { label: t.stat1Label, value: t.stat1Value, color: "text-primary-light" },
    { label: t.stat2Label, value: t.stat2Value, color: "text-metric-green" },
    { label: t.stat3Label, value: t.stat3Value, color: "text-secondary" },
    { label: t.stat4Label, value: t.stat4Value, color: "text-metric-yellow" },
  ];

  return (
    <section className="relative py-24 -mt-40 z-20 bg-gradient-to-b from-bg-dark/80 to-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/[0.015] backdrop-blur-lg border border-white/[0.04] rounded-2xl p-6 hover:bg-white/[0.04] transition-all hover:scale-105 hover:shadow-xl"
            >
              <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
