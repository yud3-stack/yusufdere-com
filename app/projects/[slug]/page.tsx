import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { CoverImage } from "@/components/content/cover-image";
import { Markdown } from "@/components/content/markdown";
import { Container } from "@/components/layout/Container";
import { BackLink } from "@/components/layout/PageIntro";
import { TechnologyBadge } from "@/components/projects/TechnologyBadge";
import { PostMeta } from "@/components/blog/PostMeta";
import { getSiteUrl } from "@/lib/site";
import { projectCoverImageUrl } from "@/lib/storage/project-covers";
import { getProjectBySlug, getPublishedProjects } from "@/lib/supabase/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const result = await getPublishedProjects();

  return (result.data ?? []).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  if (result.error) {
    return { title: "Projeler", robots: { index: false, follow: false } };
  }

  if (!result.data) {
    notFound();
  }

  const project = result.data;
  const description = project.description.trim() || "Yusuf Dere tarafından paylaşılan bir proje.";
  const url = `${getSiteUrl()}/projects/${project.slug}`;
  const image = projectCoverImageUrl(project.cover_image);

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description,
      type: "website",
      url,
      images: image ? [{ url: image, alt: project.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: project.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getProjectBySlug(slug);

  if (result.error) {
    return (
      <Container className="py-16">
        <p className="text-sm text-[#9CA3AF]">Proje şu an yüklenemedi.</p>
      </Container>
    );
  }

  if (!result.data) {
    notFound();
  }

  const project = result.data;
  const cover = projectCoverImageUrl(project.cover_image);
  const pageUrl = `${getSiteUrl()}/projects/${project.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description || undefined,
    url: pageUrl,
    image: cover || undefined,
    datePublished: project.published_at || undefined,
    author: {
      "@type": "Person",
      name: "Yusuf Dere",
      url: getSiteUrl(),
    },
  };

  return (
    <Container className="detail-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <article className="detail-article project-article">
        <BackLink href="/projects" label="Projeler" />
        <header className="detail-heading">
          <h1>{project.title}</h1>
          {project.description ? <p className="detail-description">{project.description}</p> : null}
          {project.technologies.length > 0 ? (
            <ul className="technology-list">{project.technologies.map(name => <li key={name}><TechnologyBadge name={name} /></li>)}</ul>
          ) : null}
          <PostMeta date={project.published_at} />
          {project.github_url || project.live_url ? (
            <div className="button-row">
              {project.github_url ? <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="button button-accent">GitHub<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
              {project.live_url ? <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="button button-secondary">Canlı Demo<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
            </div>
          ) : null}
        </header>
        <CoverImage src={cover} alt={project.title} className="detail-cover" sizes="(min-width: 1024px) 960px, 100vw" priority />
        {project.content?.trim() ? (
          <div className="article-body">
            <Markdown markdown={project.content} variant="article" className="min-w-0 text-[17px] leading-[1.75] text-[#374151] sm:text-[18px]" />
          </div>
        ) : null}
      </article>
    </Container>
  );
}
