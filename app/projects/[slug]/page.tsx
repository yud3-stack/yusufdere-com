import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
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
  const project = await getProjectBySlug(slug);

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
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <InteriorPage>
      <PageIntro
        eyebrow="Project"
        title={project.title}
        description={project.shortDescription}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr]">
            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Status
                </p>
                <p className="mt-3 text-lg font-medium text-foreground">
                  {project.status}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Category
                </p>
                <p className="mt-3 text-lg font-medium text-foreground">
                  {project.category}
                </p>
              </div>
            </aside>

            <div>
              {project.techStack.length > 0 ? (
                <div className="mb-10 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="space-y-6 text-base leading-8 text-muted-foreground">
                {project.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
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
            </div>
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
