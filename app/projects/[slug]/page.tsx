import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getProjectBySlug } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

type ProjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, "en");

  if (!project) {
    return createMetadata({
      title: "Project",
      description: "A project from Yusuf Dere.",
      path: `/projects/${slug}`,
      robots: {
        index: false,
        follow: false,
      },
    });
  }

  return createMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/projects/${project.slug || slug}`,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, "en");

  if (!project) {
    notFound();
  }

  const hasLinks = Boolean(project.liveUrl || project.githubUrl);
  const hasTechStack = project.techStack.length > 0;

  return (
    <InteriorPage>
      <PageIntro
        eyebrow="Project"
        title={project.title}
        description={project.shortDescription}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.32fr_1fr]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Project
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Badge>{project.status}</Badge>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                    {project.category}
                  </span>
                  {project.featured ? (
                    <span className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-xs font-medium text-foreground">
                      Featured
                    </span>
                  ) : null}
                </div>
              </div>
              {hasTechStack ? (
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Stack
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.techStack.slice(0, 6).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-background/30 px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
              {hasLinks ? (
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Links
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {project.liveUrl ? (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground transition-opacity duration-200 hover:opacity-70"
                      >
                        Live site
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ) : null}
                    {project.githubUrl ? (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-foreground transition-opacity duration-200 hover:opacity-70"
                      >
                        GitHub
                        <ArrowUpRight className="size-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </aside>

            <div className="space-y-14">
              <section className="border-t border-border pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Overview
                </p>
                <div className="mt-6 space-y-6 text-base leading-8 text-muted-foreground">
                  <p className="text-xl leading-9 text-foreground/90">
                    {project.shortDescription}
                  </p>
                </div>
              </section>

              {project.body.length > 0 ? (
                <section className="border-t border-border pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Why it exists
                  </p>
                  <div className="mt-6 space-y-6 text-base leading-8 text-muted-foreground">
                    {project.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="border-t border-border pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current status
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-surface p-5">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="mt-3 text-xl font-medium text-foreground">
                      {project.status}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-surface p-5">
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="mt-3 text-xl font-medium text-foreground">
                      {project.category}
                    </p>
                  </div>
                </div>
              </section>

              {hasTechStack ? (
                <section className="border-t border-border pt-8">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Tech stack
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              <section className="border-t border-border pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Links
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  {project.liveUrl ? (
                    <Button
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit
                    </Button>
                  ) : null}
                  {project.githubUrl ? (
                    <Button
                      href={project.githubUrl}
                      variant="secondary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </Button>
                  ) : null}
                  <Link
                    href="/projects"
                    className="inline-flex h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  >
                    All projects
                    <ArrowUpRight className="size-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
