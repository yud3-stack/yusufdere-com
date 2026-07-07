import { SiteHeader } from "@/components/layout/site-header";
import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactSection } from "@/components/sections/contact-section";
import { GalleryUsesSection } from "@/components/sections/gallery-uses-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NowJournalSection } from "@/components/sections/now-journal-section";
import { ProjectsPreviewSection } from "@/components/sections/projects-preview-section";
import { getSiteSettings } from "@/lib/sanity/data";
import { getHomepageData } from "@/lib/sanity/homepage";
import { createMetadata, localizedSeo } from "@/lib/seo";

export async function generateMetadata() {
  const siteSettings = await getSiteSettings();

  return createMetadata({
    title: siteSettings.seoTitle || siteSettings.name || undefined,
    description: siteSettings.seoDescription || localizedSeo.en.homeDescription,
    path: "/",
    locale: "en",
    absoluteTitle: true,
  });
}

export default async function Home() {
  const homepageData = await getHomepageData();

  return (
    <>
      <SiteHeader variant="home" />
      <main className="min-h-screen overflow-hidden">
        <HeroSection siteSettings={homepageData.siteSettings} />
        <AboutPreviewSection aboutPage={homepageData.aboutPage} />
        <ProjectsPreviewSection projects={homepageData.projects} />
        <NowJournalSection
          nowItems={homepageData.nowItems}
          journalPosts={homepageData.journalPosts}
        />
        <GalleryUsesSection
          galleryItems={homepageData.galleryItems}
          usesItems={homepageData.usesItems}
        />
        <ContactSection siteSettings={homepageData.siteSettings} />
      </main>
    </>
  );
}
