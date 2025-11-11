import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UNHIREABLE - Neural Career System",
  description: "AI-powered career assessment and job matching platform. 89% success rate vs 12% industry average.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

import { Providers } from "./providers";
import Header from "@/components/nav/Header";
import { CustomCursor } from "@/components/CustomCursor";
import { Footer } from "@/components/Footer";

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
