import type { Metadata } from "next";
import { JsonLd } from "@/components/content/JsonLd";
import { websiteSchema } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";
import { Hero } from "@/components/home/Hero";
import { SectionNav } from "@/components/home/SectionNav";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { HomeCTA } from "@/components/home/HomeCTA";

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
      <Hero />
      <SectionNav />
      <LatestPosts />
      <ProjectsSection />
      <HomeCTA />
    </>
  );
}
