import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactSection } from "@/components/sections/contact-section";
import { GalleryUsesSection } from "@/components/sections/gallery-uses-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NowJournalSection } from "@/components/sections/now-journal-section";
import { ProjectsPreviewSection } from "@/components/sections/projects-preview-section";
import { getHomepageData } from "@/lib/sanity/homepage";

export default async function Home() {
  const homepageData = await getHomepageData();

  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection siteSettings={homepageData.siteSettings} />
      <AboutPreviewSection />
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
  );
}
