import type { Metadata } from "next";
import { AboutScene } from "@/components/about/AboutScene";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";
import { site } from "@/data/site";

const title = "Hakkımda";
const description = site.aboutSummary;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/about`,
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultSocialImage.url],
  },
};

export default function AboutPage() {
  return <AboutScene />;
}
