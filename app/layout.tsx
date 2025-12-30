import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LandingBits - AI Social Media Scheduler | Automate Your Content",
  description:
    "AI-powered social media scheduling for Twitter, LinkedIn & TikTok. Save 10 hours/week with conversational AI content creation. Start free trial today!",
  keywords:
    "AI social media scheduler, automated posting, content creation AI, Twitter scheduler, LinkedIn automation, social media management",
  authors: [{ name: "LandingBits" }],
  openGraph: {
    title: "LandingBits - AI Social Media Scheduler",
    description: "Save 10 hours/week with AI-powered social media scheduling",
    url: "https://landingbits.net",
    siteName: "LandingBits",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LandingBits Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LandingBits - AI Social Media Scheduler",
    description: "Save 10 hours/week with AI-powered scheduling",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics 4 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXXXXX', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${sora.variable} font-body antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
