import { translations, type Locale } from '@/lib/i18n'

type Props = {
  locale: Locale
}

export default function Footer({ locale }: Props) {
  const t = translations[locale].footer

  return (
    <footer className="border-t border-white/10 py-12 bg-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{t.brandName}</h3>
            <p className="text-slate-400 text-sm">
              {t.brandDescription}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.productTitle}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.productFeatures}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.productPricing}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.productChangelog}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.productRoadmap}
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.companyTitle}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.companyAbout}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.companyBlog}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.companyCareers}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.companyContact}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.legalTitle}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.legalPrivacy}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.legalTerms}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {t.legalCookie}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>{t.copyright}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              {t.socialTwitter}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t.socialLinkedIn}
            </a>
            <a href="#" className="hover:text-white transition-colors">
              {t.socialGitHub}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
