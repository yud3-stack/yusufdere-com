import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProjectCard } from "@/components/cards/project-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { type ProjectPreview } from "@/content/home";
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
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
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
        {projects.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                locale={locale}
                dictionary={dictionary}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            className="mt-10"
            title={dictionary.empty.projects.title}
            description={dictionary.empty.projects.description}
            actionLabel={dictionary.nav.projects}
            href={withLocalePrefix("/projects", locale)}
          />
        )}
      </Container>
    </section>
  );
}
