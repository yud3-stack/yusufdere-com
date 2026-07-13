import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/cards/project-card";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { type ProjectPreview } from "@/content/home";
import { getStudioProject } from "@/content/studio";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type ProjectsPreviewSectionProps = {
  projects?: ProjectPreview[];
  locale?: Locale;
  dictionary?: Dictionary;
};

export function ProjectsPreviewSection({
  projects = [],
  locale = "en",
  dictionary = getDictionary(locale),
}: ProjectsPreviewSectionProps) {
  const studioProject = getStudioProject(locale);

  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow={dictionary.nav.projects}
            title={dictionary.home.projectsTitle}
            description={dictionary.home.projectsDescription}
            action={
              <Link
                href={withLocalePrefix("/projects", locale)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {dictionary.actions.viewAllProjects}
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>
        {projects.length > 0 ? (
          <Stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <StaggerItem key={project.title}>
                <ProjectCard
                  project={project}
                  locale={locale}
                  dictionary={dictionary}
                />
              </StaggerItem>
            ))}
            <StaggerItem key={studioProject.title}>
              <ProjectCard
                project={studioProject}
                locale={locale}
                dictionary={dictionary}
              />
            </StaggerItem>
          </Stagger>
        ) : (
          <div className="mt-10 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <EmptyState
                title={dictionary.empty.projects.title}
                description={dictionary.empty.projects.description}
                actionLabel={dictionary.nav.projects}
                href={withLocalePrefix("/projects", locale)}
              />
            </Reveal>
            <Reveal>
              <ProjectCard
                project={studioProject}
                locale={locale}
                dictionary={dictionary}
              />
            </Reveal>
          </div>
        )}
      </Container>
    </section>
  );
}
