import { Bot, Calendar, Palette, BarChart3, Link2, Zap } from "lucide-react";
import { translations, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
};

export default function Features({ locale }: Props) {
  const t = translations[locale].features;

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
    <section className="py-24 bg-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/30 rounded-full mb-6">
          <Zap className="text-slate-400" size={16} />
          <span className="text-slate-400 text-sm font-medium">{t.badge}</span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {t.heading}
        </h2>
        <p className="text-xl text-slate-400 mb-16 max-w-2xl">{t.subheading}</p>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-slate-900/20 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:bg-slate-800/30 hover:border-slate-700/50 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-700/60 transition-colors">
                  <Icon className="text-slate-300" size={24} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-400 text-sm leading-relaxed">
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
