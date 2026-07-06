import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactSection } from "@/components/sections/contact-section";
import { GalleryUsesSection } from "@/components/sections/gallery-uses-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NowJournalSection } from "@/components/sections/now-journal-section";
import { ProjectsPreviewSection } from "@/components/sections/projects-preview-section";
import { getDictionary } from "@/dictionaries";
import { getSiteSettings } from "@/lib/sanity/data";
import { getHomepageData } from "@/lib/sanity/homepage";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export async function generateMetadata() {
  const siteSettings = await getSiteSettings(locale);

  return createMetadata({
    title: siteSettings.seoTitle || siteSettings.name || undefined,
    description: siteSettings.seoDescription || dictionary.home.siteDescription,
    path: "/tr",
    absoluteTitle: true,
  });
}

export default async function TurkishHome() {
  const homepageData = await getHomepageData(locale);

  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection
        siteSettings={homepageData.siteSettings}
        locale={locale}
        dictionary={dictionary}
      />
      <AboutPreviewSection
        aboutPage={homepageData.aboutPage}
        locale={locale}
        dictionary={dictionary}
      />
      <ProjectsPreviewSection
        projects={homepageData.projects}
        locale={locale}
        dictionary={dictionary}
      />
      <NowJournalSection
        nowItems={homepageData.nowItems}
        journalPosts={homepageData.journalPosts}
        locale={locale}
        dictionary={dictionary}
      />
      <GalleryUsesSection
        galleryItems={homepageData.galleryItems}
        usesItems={homepageData.usesItems}
        locale={locale}
        dictionary={dictionary}
      />
      <ContactSection
        siteSettings={homepageData.siteSettings}
        dictionary={dictionary}
      />
    </main>
  );
}
