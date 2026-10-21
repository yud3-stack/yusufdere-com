import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectSummary } from "@/types/db";

export function ProjectGrid({ projects, headingLevel = 3 }: { projects: ProjectSummary[]; headingLevel?: 2 | 3 }) {
  return (
    <div className={`project-grid project-count-${Math.min(projects.length, 4)}`}>
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          wide={projects.length === 1}
          compact={projects.length >= 4}
          technologyLimit={3}
          headingLevel={headingLevel}
        />
      ))}
    </div>
  );
}
