import { Hero } from "@/components/home/Hero";
import { SectionNav } from "@/components/home/SectionNav";
import { LatestPosts } from "@/components/home/LatestPosts";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { HomeCTA } from "@/components/home/HomeCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SectionNav />
      <LatestPosts />
      <ProjectsSection />
      <HomeCTA />
    </>
  );
}
