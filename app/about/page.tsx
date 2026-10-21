import type { Metadata } from "next";
import { AboutContact } from "@/components/about/AboutContact";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutProjects } from "@/components/about/AboutProjects";
import { FocusAreas } from "@/components/about/FocusAreas";
import { TechStack } from "@/components/about/TechStack";
import { WorkingStyle } from "@/components/about/WorkingStyle";
import { getSiteUrl } from "@/lib/site";

const title = "Hakkımda";
const description =
  "Web geliştirme ağırlıklı çalışan software developer Yusuf Dere'nin projeleri, çalışma alanları ve kullandığı teknolojiler.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/about` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/about`,
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutIntro />
      <FocusAreas />
      <AboutProjects />
      <WorkingStyle />
      <TechStack />
      <AboutContact />
    </div>
  );
}
