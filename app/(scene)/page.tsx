import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { HomeScene } from "@/components/home/HomeScene";
import { websiteSchema } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";

export const metadata: Metadata = {
  alternates: { canonical: `${getSiteUrl()}/` },
  openGraph: {
    title: "Yusuf Dere",
    description: "Yazılım, projeler ve öğrendiklerim üzerine.",
    url: `${getSiteUrl()}/`,
    siteName: "Yusuf Dere",
    locale: "tr_TR",
    type: "website",
    images: [defaultSocialImage],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={websiteSchema(getSiteUrl())} />
      <HomeScene />
    </>
  );
}
