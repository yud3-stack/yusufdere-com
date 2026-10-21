import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer, PublicFooter } from "@/components/layout/Footer";
import { PublicShell } from "@/components/layout/PublicShell";
import { Header } from "@/components/layout/Header";
import { PublicSearch } from "@/components/layout/PublicSearch";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";
import "./globals.css";
import "./public-site.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Yusuf Dere",
    template: "%s · Yusuf Dere",
  },
  description:
    "Yazılım ve teknoloji üzerine öğrendiklerimi, karşılaştığım problemleri ve geliştirdiğim projeleri paylaştığım kişisel alanım.",
  openGraph: {
    title: "Yusuf Dere",
    description: "Yazılım, projeler ve öğrendiklerim üzerine.",
    siteName: "Yusuf Dere",
    locale: "tr_TR",
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yusuf Dere",
    description: "Yazılım, projeler ve öğrendiklerim üzerine.",
    images: [defaultSocialImage.url],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAF9] text-[#111827]">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
        >
          İçeriğe geç
        </a>
        <PublicShell header={<Header search={<PublicSearch />} />} footer={<Footer />} publicFooter={<PublicFooter />}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
