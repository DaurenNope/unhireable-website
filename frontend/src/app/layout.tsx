import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: {
    default: "UNHIREABLE - Neural Career System",
    template: "%s | UNHIREABLE",
  },
  description: "AI-powered career assessment and job matching platform. 89% success rate vs 12% industry average. Get hired in 21 days vs 4.5 months traditional.",
  keywords: [
    "neural career system",
    "AI job matching",
    "career assessment",
    "job search AI",
    "resume builder",
    "learning paths",
    "career intelligence",
    "predictive analytics",
    "AI-powered job matching",
    "neural personality assessment",
    "personalized learning paths",
    "career readiness score",
    "job security signals",
    "promotion probability",
    "pivot readiness analysis",
  ],
  authors: [{ name: "UNHIREABLE" }],
  creator: "UNHIREABLE",
  publisher: "UNHIREABLE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://unhireable-website.vercel.app'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://unhireable-website.vercel.app',
    title: "UNHIREABLE - Neural Career System",
    description: "AI-powered career assessment and job matching platform. 89% success rate vs 12% industry average. Get hired in 21 days vs 4.5 months traditional.",
    siteName: "UNHIREABLE",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UNHIREABLE - Neural Career System',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UNHIREABLE - Neural Career System",
    description: "AI-powered career assessment and job matching platform. 89% success rate vs 12% industry average.",
    images: ['/og-image.png'],
    creator: "@unhireable",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
};

import { Providers } from "./providers";
import Header from "../components/nav/Header";
import { CustomCursor } from "../components/CustomCursor";
import { Footer } from "../components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Providers>
          <CustomCursor />
          <Header />
          <main className="flex-1 pt-0.5 sm:pt-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
