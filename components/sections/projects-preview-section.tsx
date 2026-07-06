import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/cards/project-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { type ProjectPreview } from "@/content/home";

type ProjectsPreviewSectionProps = {
  projects?: ProjectPreview[];
};

export function ProjectsPreviewSection({
  projects = [],
}: ProjectsPreviewSectionProps) {
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
        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            title="Projects are being prepared."
            description="New products, experiments and build logs will appear here soon."
            actionLabel="Projects"
            href="/projects"
          />
        )}
      </Container>
    </section>
  );
}
