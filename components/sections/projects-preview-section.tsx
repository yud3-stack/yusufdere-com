import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/cards/project-card";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { featuredProjects } from "@/content/home";

export function ProjectsPreviewSection() {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Projects"
          title="Focused experiments, products, and systems."
          description="A small selection of things being shaped with care, usefulness, and a long-term point of view."
          action={
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              View all projects
              <ArrowRight className="size-4" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}
