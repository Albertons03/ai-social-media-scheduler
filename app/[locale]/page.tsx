import { Metadata } from 'next';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import Features from '../components/landing/Features';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FinalCTA from '../components/landing/FinalCTA';
import Footer from '../components/landing/Footer';
import { translations, type Locale } from '@/lib/i18n';

type Props = {
  params: Promise<{ locale: Locale }>;
};

// Generate metadata for each locale
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://landingbits.net";
  
  return {
    title: "LandingBits - AI Social Media Scheduler | Automate Your Content",
    description: "AI-powered social media scheduling for Twitter, LinkedIn & TikTok. Save 10 hours/week with conversational AI content creation.",
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'en': `${baseUrl}/en`,
        'de': `${baseUrl}/de`,
        'hu': `${baseUrl}/hu`
      }
    },
    openGraph: {
      title: "LandingBits - AI Social Media Scheduler",
      description: "Save 10 hours/week with AI-powered social media scheduling",
      url: `${baseUrl}/${locale}`,
      siteName: "LandingBits",
      locale: locale === 'en' ? 'en_US' : locale === 'de' ? 'de_DE' : 'hu_HU',
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "LandingBits Dashboard Preview",
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  const t = translations[locale];

  return (
    <>
      <main className="min-h-screen">
        <Hero locale={locale} />
        <Stats locale={locale} />
        <Features locale={locale} />
        <Pricing locale={locale} />
        <Testimonials locale={locale} />
        <FinalCTA locale={locale} />
        <Footer locale={locale} />
      </main>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'LandingBits',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '340',
            },
          }),
        }}
      />
    </>
  );
}
