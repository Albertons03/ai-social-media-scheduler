import { Star } from "lucide-react";
import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function Testimonials({ locale }: Props) {
  const t = translations[locale].testimonials

  const testimonials = [
    {
      text: t.testimonial1Text,
      name: t.testimonial1Name,
      role: t.testimonial1Role,
      company: t.testimonial1Company,
      avatar: "SJ",
      rating: 5,
    },
    {
      text: t.testimonial2Text,
      name: t.testimonial2Name,
      role: t.testimonial2Role,
      company: t.testimonial2Company,
      avatar: "MC",
      rating: 5,
    },
    {
      text: t.testimonial3Text,
      name: t.testimonial3Name,
      role: t.testimonial3Role,
      company: t.testimonial3Company,
      avatar: "ER",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-metric-yellow/10 border border-metric-yellow/20 rounded-full mb-6">
          <Star className="text-metric-yellow" size={16} />
          <span className="text-metric-yellow text-sm font-medium">
            {t.badge}
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          {t.heading}
        </h2>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/[0.02] backdrop-blur-lg border border-white/[0.06] rounded-3xl p-8 hover:bg-white/[0.06] transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-metric-yellow fill-metric-yellow"
                    size={20}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-primary-light to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.avatar}
                </div>

                <div>
                  <div className="text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {testimonial.role} @ {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
