"use client";

import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import {
  projectPresentations,
  type ProjectVisualKind,
} from "@/data/project-showcase";

export type ShowcaseProject = {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  cover: string | null;
  kind: ProjectVisualKind;
  category: string;
};
const number = (value: number) => String(value).padStart(2, "0");

export function ProjectShowcase({
  projects,
  error,
}: {
  projects: ShowcaseProject[];
  error: boolean;
}) {
  const [selected, setSelected] = useState(0);
  const index = Math.min(selected, Math.max(0, projects.length - 1));
  const project = projects[index];
  const start = Math.floor(index / 4) * 4;
  const presentation = project ? projectPresentations[project.slug] : undefined;
  function change(next: number) {
    setSelected(Math.max(0, Math.min(projects.length - 1, next)));
  }
  function navigate(event: KeyboardEvent<HTMLElement>) {
    const direction = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    }[event.key];
    if (direction) {
      event.preventDefault();
      change(index + direction);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      change(event.key === "Home" ? 0 : projects.length - 1);
    }
  }

  return (
    <section className="projects-showcase" aria-labelledby="projects-heading">
      <header className="projects-page-heading">
        <h1 id="projects-heading">Projeler</h1>
        <span>{number(projects.length)} çalışma</span>
      </header>
      {project ? (
        <div className="projects-layout">
          <aside className="projects-directory">
            <nav
              className="projects-directory-list"
              aria-label="Proje seçimi"
              onKeyDown={navigate}
            >
              {projects.slice(start, start + 4).map((entry, offset) => (
                <button
                  type="button"
                  key={entry.id}
                  className={entry.id === project.id ? "is-selected" : ""}
                  aria-pressed={entry.id === project.id}
                  aria-controls="project-selected"
                  onClick={() => change(start + offset)}
                >
                  <span className="project-directory-index">
                    {number(start + offset + 1)}
                  </span>
                  <strong>{entry.title}</strong>
                  <span className="project-directory-tagline">
                    {projectPresentations[entry.slug]?.tagline ??
                      entry.category}
                  </span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              ))}
            </nav>
            <p className="projects-directory-note">
              Kendi ihtiyaçlarımdan doğan araçlar ve deneyler.
            </p>
          </aside>
          <article
            className="project-selected"
            id="project-selected"
            aria-labelledby="project-name"
          >
            <header
              className="project-selected-header"
              key={`copy-${project.id}`}
            >
              <p className="project-category">{project.category}</p>
              <h2 id="project-name">{project.title}</h2>
              <p className="project-intro">
                {presentation?.intro ?? project.description}
              </p>
              {project.technologies.length ? (
                <ul
                  className="project-technologies"
                  aria-label="Kullanılan teknolojiler"
                >
                  {project.technologies.slice(0, 5).map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                  {project.technologies.length > 5 ? (
                    <li>+{project.technologies.length - 5}</li>
                  ) : null}
                </ul>
              ) : null}
              <div className="project-actions">
                <Link
                  href={`/projects/${project.slug}`}
                  className="project-open"
                >
                  Projeyi incele <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Canlı demo <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </header>
            <div
              className="project-selected-visual"
              key={`visual-${project.id}`}
            >
              <ProjectVisual
                title={project.title}
                kind={project.kind}
                cover={project.cover}
              />
            </div>
            <footer className="project-selected-footer">
              <div className="project-problem">
                <h3>Ne çözüyor?</h3>
                <p>{project.description}</p>
              </div>
              <nav
                className="project-pagination"
                aria-label="Projeler arasında geçiş"
                onKeyDown={navigate}
              >
                <span>
                  {number(index + 1)} / {number(projects.length)}
                </span>
                <button
                  type="button"
                  aria-label="Önceki proje"
                  disabled={index === 0}
                  onClick={() => change(index - 1)}
                >
                  <ArrowLeft size={17} />
                </button>
                <button
                  type="button"
                  aria-label="Sonraki proje"
                  disabled={index === projects.length - 1}
                  onClick={() => change(index + 1)}
                >
                  <ArrowRight size={17} />
                </button>
              </nav>
            </footer>
          </article>
        </div>
      ) : (
        <div className="projects-empty">
          <Layers size={36} strokeWidth={1} />
          <h2>
            {error ? "Projeler yüklenemedi." : "Yeni projelere yer açıyorum."}
          </h2>
          <p>
            {error
              ? "Lütfen daha sonra tekrar dene."
              : "İlk çalışma yayınlandığında burada görünecek."}
          </p>
        </div>
      )}
      <p className="sr-only" role="status">
        {project ? `${index + 1} / ${projects.length}: ${project.title}` : ""}
      </p>
    </section>
  );
}
