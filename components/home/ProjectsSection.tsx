import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { getFeaturedProjects, getPublishedProjects } from "@/lib/supabase/queries";

export async function ProjectsSection() {
  const featured = await getFeaturedProjects();
  const published = featured.data && featured.data.length > 0 ? null : await getPublishedProjects();
  const result = featured.data && featured.data.length > 0 ? featured : published;
  const projects = result?.data?.slice(0, 4) ?? [];

  return (
    <section id="projeler" className="home-section">
      <Container>
        <SectionHeading title="Projelerim" href="/projects" label="Tüm Projeler" />
        {result?.error ? <p className="content-state">Projeler şu an yüklenemedi.</p> : null}
        {!result?.error && !projects.length ? <p className="content-state">Henüz yayınlanmış bir proje yok.</p> : null}
        {projects.length > 0 ? <ProjectGrid projects={projects} /> : null}
      </Container>
    </section>
  );
}
