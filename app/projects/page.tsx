import { ProjectCard } from "@/components/cards/project-card";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { projectsPage } from "@/content/projects";
import { getAllProjects } from "@/lib/sanity/data";
import { createMetadata, localizedSeo } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
    title: "Projects",
    description: localizedSeo.en.projectsDescription,
    path: "/projects",
    locale: "en",
  });
}

export default async function ProjectsPage() {
  const projects = await getAllProjects("en");
  const highlightedProject =
    projects.find((project) => project.featured) || projects[0];
  const remainingProjects = highlightedProject
    ? projects.filter((project) => project.href !== highlightedProject.href)
    : [];

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={projectsPage.eyebrow}
        title={projectsPage.title}
        description={projectsPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {highlightedProject ? (
            <div className="space-y-14">
              <div>
                <div className="mb-5 flex items-center justify-between gap-6">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    Highlighted
                  </p>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    A closer look at the work currently carrying the most signal.
                  </p>
                </div>
                <ProjectCard project={highlightedProject} variant="highlight" />
              </div>

              {remainingProjects.length > 0 ? (
                <div>
                  <div className="mb-5 flex items-end justify-between gap-6 border-t border-border pt-8">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        Project Index
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                        More work in motion.
                      </h2>
                    </div>
                    <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">
                      Small bets, product ideas, and useful systems as they move
                      from note to build.
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {remainingProjects.map((project) => (
                      <ProjectCard key={project.title} project={project} />
                    ))}
                  </div>
                </div>
              ) : null}
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
