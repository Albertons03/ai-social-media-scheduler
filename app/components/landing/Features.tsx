import { Bot, Calendar, Palette, BarChart3, Link2, Zap } from "lucide-react";
import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function Features({ locale }: Props) {
  const t = translations[locale].features

  const features = [
    {
      icon: Bot,
      title: t.feature1Title,
      description: t.feature1Description,
    },
    {
      icon: Calendar,
      title: t.feature2Title,
      description: t.feature2Description,
    },
    {
      icon: Palette,
      title: t.feature3Title,
      description: t.feature3Description,
    },
    {
      icon: BarChart3,
      title: t.feature4Title,
      description: t.feature4Description,
    },
    {
      icon: Link2,
      title: t.feature5Title,
      description: t.feature5Description,
    },
    {
      icon: Zap,
      title: t.feature6Title,
      description: t.feature6Description,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-bg-dark/50 via-bg-dark to-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light/10 border border-primary-light/20 rounded-full mb-6">
          <Zap className="text-primary-light" size={16} />
          <span className="text-primary-light text-sm font-medium">
            {t.badge}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t.heading}
        </h2>
        <p className="text-xl text-slate-400 mb-16 max-w-2xl">
          {t.subheading}
        </p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/[0.03] backdrop-blur-lg border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.08] hover:border-primary-light/50 transition-all cursor-pointer"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-primary-light/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="text-primary-light" size={28} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
