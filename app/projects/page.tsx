import type { Metadata } from "next";

import { ProjectCard } from "@/components/cards/project-card";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { projectItems, projectsPage } from "@/content/projects";

export const metadata: Metadata = {
  title: "Projects",
  description: projectsPage.description,
};

export default function ProjectsPage() {
  return (
    <InteriorPage>
      <PageIntro
        eyebrow={projectsPage.eyebrow}
        title={projectsPage.title}
        description={projectsPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {projectItems.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
