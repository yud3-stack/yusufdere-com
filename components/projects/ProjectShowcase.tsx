"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { ArrowUpRight, ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { projectPresentations, projectsEditorial, type ProjectVisualKind } from "@/data/project-showcase";
import { projectPage } from "@/lib/project-pagination";

export type ShowcaseProject = {
  id: string; title: string; slug: string; description: string;
  technologies: string[]; githubUrl: string | null; liveUrl: string | null;
  cover: string | null; kind: ProjectVisualKind; category: string;
};
const number = (value: number) => String(value).padStart(2, "0");
function subscribeSize(update: () => void) {
  const query = window.matchMedia("(max-width: 850px)");
  query.addEventListener("change", update);
  return () => query.removeEventListener("change", update);
}
const clientSize = () => window.matchMedia("(max-width: 850px)").matches ? 2 : 4;
const serverSize = () => 4;

export function ProjectShowcase({ projects, error }: { projects: ShowcaseProject[]; error: boolean }) {
  const size = useSyncExternalStore(subscribeSize, clientSize, serverSize);
  // Keep the current group in view when crossing the mobile breakpoint.
  const [anchor, setAnchor] = useState(0);
  const gallery = useRef<HTMLUListElement>(null);
  const { page, pages, start, end } = projectPage(projects.length, anchor, size);
  function change(next: number) {
    setAnchor(Math.max(0, Math.min(pages - 1, next)) * size);
    if (size === 2) requestAnimationFrame(() => gallery.current?.scrollIntoView({
      block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    }));
  }
  function navigate(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault(); change(page + (event.key === "ArrowRight" ? 1 : -1));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault(); change(event.key === "Home" ? 0 : pages - 1);
    }
  }
  return (
    <section className="projects-editorial" aria-labelledby="projects-heading">
      <div className="projects-editorial-intro">
        <p className="projects-eyebrow">{projectsEditorial.eyebrow}</p>
        <h1 id="projects-heading">{projectsEditorial.title[0]}<br />{projectsEditorial.title[1]}<br /><em>{projectsEditorial.emphasis}</em></h1>
        <p className="projects-editorial-description">{projectsEditorial.description}</p>
        <p className="projects-editorial-count">{number(projects.length)} çalışma</p>
        <p className="projects-editorial-signature">{projectsEditorial.signature}</p>
      </div>
      <div className="projects-editorial-gallery">
        {projects.length ? <>
          <ul ref={gallery} className="projects-editorial-grid" id="projects-gallery" key={`${size}-${page}`}>
            {projects.slice(start, end).map((project, offset) => (
              <li key={project.id}>
                <Link className="project-gallery-link" href={`/projects/${project.slug}`}>
                  <div className="project-gallery-visual" aria-hidden="true">
                    <ProjectVisual title={project.title} kind={project.kind} cover={project.cover} />
                  </div>
                  <p className="project-gallery-category">{number(start + offset + 1)} / {project.category}</p>
                  <div className="project-gallery-title"><h2>{project.title}</h2><ArrowUpRight size={20} aria-hidden="true" /></div>
                  <p className="project-gallery-description">{projectPresentations[project.slug]?.intro ?? project.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <nav className="projects-gallery-pagination" aria-label="Proje sayfaları" onKeyDown={navigate}>
            <button type="button" aria-label="Önceki proje sayfası" aria-controls="projects-gallery" disabled={page === 0} onClick={() => change(page - 1)}><ArrowLeft size={17} aria-hidden="true" /></button>
            <span aria-label={`Sayfa ${page + 1} / ${pages}`}>{number(page + 1)} / {number(pages)}</span>
            <button type="button" aria-label="Sonraki proje sayfası" aria-controls="projects-gallery" disabled={page >= pages - 1} onClick={() => change(page + 1)}><ArrowRight size={17} aria-hidden="true" /></button>
          </nav>
          <p className="sr-only" role="status" aria-atomic="true">Sayfa {page + 1} / {pages}. {projects.slice(start, end).map(project => project.title).join(", ")}</p>
        </> : <div className="projects-gallery-empty">
          <Layers size={32} strokeWidth={1} aria-hidden="true" />
          <h2>{error ? "Projeler yüklenemedi." : "Yeni projelere yer açıyorum."}</h2>
          <p>{error ? "Lütfen daha sonra tekrar dene." : "İlk çalışma yayınlandığında burada görünecek."}</p>
        </div>}
      </div>
    </section>
  );
}
