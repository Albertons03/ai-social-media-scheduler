import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "LandingBits - AI Social Media Scheduler",
  description: "AI-powered social media scheduling for Twitter, LinkedIn & TikTok",
  alternates: {
    canonical: "https://landingbits.net/en"
  },
  robots: {
    index: false, // Don't index root, only locale pages
    follow: true
  }
};

export default function RootPage() {
  // Redirect to default locale (English) - but mark as noindex
  redirect('/en');
}
