import type { Metadata } from "next";
import { ProjectShowcase } from "@/components/projects/ProjectShowcase";
import { projectPresentations } from "@/data/project-showcase";
import { projectCoverImageUrl } from "@/lib/storage/project-covers";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";
import { getPublishedProjects } from "@/lib/supabase/queries";

const title = "Projeler";
const description = "Geliştirdiğim web, masaüstü ve diğer yazılım projeleri.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/projects` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/projects`,
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultSocialImage.url],
  },
};

export default async function ProjectsPage() {
  const result = await getPublishedProjects();
  const projects = result.data ?? [];

  return (
    <ProjectShowcase
      error={!!result.error}
      projects={projects.map((project) => ({
        id: project.id,
        title: project.title,
        slug: project.slug,
        description: project.description,
        technologies: project.technologies,
        githubUrl: project.github_url,
        liveUrl: project.live_url,
        cover: projectCoverImageUrl(project.cover_image),
        kind: projectPresentations[project.slug]?.kind ?? "generic",
        category:
          projectPresentations[project.slug]?.category ?? "Yazılım / Deneyler",
      }))}
    />
  );
}
