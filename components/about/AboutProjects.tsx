import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Container } from "@/components/layout/Container";
import { getFeaturedProjects, getPublishedProjects } from "@/lib/supabase/queries";

export async function AboutProjects() {
  const featured = await getFeaturedProjects();
  const published = featured.data && featured.data.length > 0 ? null : await getPublishedProjects();
  const projects = (featured.data && featured.data.length > 0 ? featured.data : (published?.data ?? [])).slice(0, 3);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="about-section">
      <Container>
        <h2>Projeler Üzerinden</h2>
        <p className="intro-description">Ne üzerinde çalıştığımı anlatmanın en iyi yolu ortaya çıkan işler.</p>
        <div className="mt-6"><ProjectGrid projects={projects} /></div>
      </Container>
    </section>
  );
}
