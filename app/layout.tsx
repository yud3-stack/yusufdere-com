import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { CommandMenu } from "@/components/command/command-menu";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { SplashScreen } from "@/components/layout/splash-screen";
import { BackToTop } from "@/components/ui/back-to-top";
import {
  absoluteUrl,
  defaultSeo,
  languageAlternates,
  ogImagePath,
  siteUrl,
} from "@/lib/seo";

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
  metadataBase: new URL("https://yusufdere.com"),
  title: {
    default: defaultSeo.title,
    template: `%s | ${defaultSeo.siteName}`,
  },
  description: defaultSeo.description,
  icons: {
    icon: "/brand/yd-logo.svg",
    shortcut: "/brand/yd-logo.svg",
    apple: "/brand/yd-logo.svg",
  },
  alternates: {
    canonical: siteUrl,
    languages: languageAlternates("/"),
  },
  openGraph: {
    title: defaultSeo.title,
    description: defaultSeo.description,
    url: siteUrl,
    siteName: defaultSeo.siteName,
    locale: defaultSeo.locale,
    type: "website",
    images: [
      {
        url: absoluteUrl(ogImagePath),
        width: 1200,
        height: 630,
        alt: defaultSeo.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultSeo.title,
    description: defaultSeo.description,
    images: [absoluteUrl(ogImagePath)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <ThemeProvider>
          {children}
          <CommandMenu />
          <SplashScreen />
          <BackToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
