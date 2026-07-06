import { ProjectCard } from "@/components/cards/project-card";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/dictionaries";
import { getAllProjects } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export function generateMetadata() {
  return createMetadata({
    title: dictionary.nav.projects,
    description: dictionary.pages.projects.description,
    path: "/tr/projects",
  });
}

export default async function TurkishProjectsPage() {
  const projects = await getAllProjects();
  const highlightedProject =
    projects.find((project) => project.featured) || projects[0];
  const remainingProjects = highlightedProject
    ? projects.filter((project) => project.href !== highlightedProject.href)
    : [];

  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={dictionary.pages.projects.eyebrow}
        title={dictionary.pages.projects.title}
        description={dictionary.pages.projects.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {highlightedProject ? (
            <div className="space-y-14">
              <div>
                <div className="mb-5 flex items-center justify-between gap-6">
                  <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                    {dictionary.labels.highlighted}
                  </p>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    {dictionary.pages.projects.highlightedDescription}
                  </p>
                </div>
                <ProjectCard
                  project={highlightedProject}
                  variant="highlight"
                  locale={locale}
                  dictionary={dictionary}
                />
              </div>

              {remainingProjects.length > 0 ? (
                <div>
                  <div className="mb-5 flex items-end justify-between gap-6 border-t border-border pt-8">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                        {dictionary.labels.projectIndex}
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                        {dictionary.pages.projects.indexTitle}
                      </h2>
                    </div>
                    <p className="hidden max-w-xs text-right text-sm leading-6 text-muted-foreground md:block">
                      {dictionary.pages.projects.indexDescription}
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {remainingProjects.map((project) => (
                      <ProjectCard
                        key={project.title}
                        project={project}
                        locale={locale}
                        dictionary={dictionary}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <EmptyState
              title={dictionary.empty.projects.title}
              description={dictionary.empty.projects.description}
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
