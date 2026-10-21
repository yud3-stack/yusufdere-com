import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CoverImage } from "@/components/content/cover-image";
import { TechnologyBadge } from "@/components/projects/TechnologyBadge";
import { projectCoverImageUrl } from "@/lib/storage/project-covers";
import type { ProjectSummary } from "@/types/db";

type ProjectCardProps = {
  project: ProjectSummary;
  compact?: boolean;
  technologyLimit?: number;
  wide?: boolean;
  headingLevel?: 2 | 3;
};

export function ProjectCard({ project, compact = false, technologyLimit, wide = false, headingLevel = 3 }: ProjectCardProps) {
  const cover = projectCoverImageUrl(project.cover_image);
  const technologies = technologyLimit ? project.technologies.slice(0, technologyLimit) : project.technologies;
  const extra = project.technologies.length - technologies.length;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className={`project-card ${cover ? "has-cover" : "no-cover"} ${wide ? "project-wide" : ""} ${compact ? "project-compact" : ""}`}>
      <Link href={`/projects/${project.slug}`} className="project-cover-link group">
        <CoverImage src={cover} alt={project.title} className="project-cover" sizes={wide ? "(min-width: 1280px) 600px, (min-width: 768px) 50vw, 100vw" : "(min-width: 1280px) 290px, (min-width: 640px) 50vw, 100vw"} />
      </Link>
      <div className="project-copy">
        {technologies.length > 0 ? (
          <ul className="technology-list">
            {technologies.map(name => <li key={name}><TechnologyBadge name={name} /></li>)}
            {extra > 0 ? <li><TechnologyBadge name={`+${extra}`} /></li> : null}
          </ul>
        ) : null}
        <Heading><Link href={`/projects/${project.slug}`}>{project.title}</Link></Heading>
        {project.description ? <p className="project-description">{project.description}</p> : null}
        <div className="project-links">
          {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> — {project.title}</span></a> : null}
          {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer">Canlı Demo<ArrowUpRight size={14} aria-hidden="true" /><span className="sr-only"> — {project.title}</span></a> : null}
          <Link href={`/projects/${project.slug}`} className="project-details">Detaylar<ArrowRight size={15} aria-hidden="true" /><span className="sr-only"> — {project.title}</span></Link>
        </div>
      </div>
    </article>
  );
}
