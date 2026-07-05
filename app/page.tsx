import { AboutPreviewSection } from "@/components/sections/about-preview-section";
import { ContactSection } from "@/components/sections/contact-section";
import { GalleryUsesSection } from "@/components/sections/gallery-uses-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NowJournalSection } from "@/components/sections/now-journal-section";
import { ProjectsPreviewSection } from "@/components/sections/projects-preview-section";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <HeroSection />
      <AboutPreviewSection />
      <ProjectsPreviewSection />
      <NowJournalSection />
      <GalleryUsesSection />
      <ContactSection />
    </main>
  );
}
