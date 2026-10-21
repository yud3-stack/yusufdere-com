import type { Metadata } from "next";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/layout/PageIntro";
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
    <Container>
      <PageIntro eyebrow="PROJELER" title="Geliştirdiklerim." description="Fikirden çalışan ürüne dönüştürdüğüm web, masaüstü ve diğer yazılım projeleri." />
      <div className="archive-content">
        {result.error ? <p className="content-state">Projeler şu an yüklenemedi.</p> : null}
        {!result.error && !projects.length ? <p className="content-state">Henüz yayınlanmış bir proje yok.</p> : null}
        {projects.length > 0 ? <ProjectGrid projects={projects} headingLevel={2} /> : null}
      </div>
    </Container>
  );
}
