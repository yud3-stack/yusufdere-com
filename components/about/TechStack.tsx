import { Container } from "@/components/layout/Container";
import { TechnologyBadge } from "@/components/projects/TechnologyBadge";
import { getPublishedProjects } from "@/lib/supabase/queries";

const siteTechnologies = ["TypeScript", "React", "Next.js", "Supabase"];

export async function TechStack() {
  const published = await getPublishedProjects();
  const fromProjects = (published.data ?? []).flatMap((project) => project.technologies);
  const projectTechnologies = [...new Set(fromProjects.filter((name) => !siteTechnologies.includes(name)))].slice(0, 8);

  return (
    <section className="about-section">
      <Container>
        <h2>Kullandığım Teknolojiler</h2>
        <ul className="about-technologies">
          {siteTechnologies.map((name) => (
            <li key={name}>
              <TechnologyBadge name={name} />
            </li>
          ))}
        </ul>
        {projectTechnologies.length > 0 ? (
          <ul className="about-technologies">
            {projectTechnologies.map((name) => (
              <li key={name}>
                <TechnologyBadge name={name} />
              </li>
            ))}
          </ul>
        ) : null}
      </Container>
    </section>
  );
}
