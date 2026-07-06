import { ProjectCard } from "@/components/cards/project-card";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { projectsPage } from "@/content/projects";
import { getAllProjects } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
  title: "Projects",
  description: projectsPage.description,
    path: "/projects",
  });
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={projectsPage.eyebrow}
        title={projectsPage.title}
        description={projectsPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {projects.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Projects are being prepared."
              description="New products, experiments and build logs will appear here soon."
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
