import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { getJournalPostBySlug } from "@/lib/sanity/data";

type JournalDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: JournalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);

  if (!post) {
    return {
      title: "Journal",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function JournalDetailPage({
  params,
}: JournalDetailPageProps) {
  const { slug } = await params;
  const post = await getJournalPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <article className="mx-auto max-w-3xl">
            <time className="text-sm text-muted-foreground">{post.date}</time>
            <div className="mt-8 space-y-7 text-lg leading-9 text-muted-foreground">
              {post.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href="/journal"
              className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity duration-200 hover:opacity-70"
            >
              Back to journal
              <ArrowUpRight className="size-4" />
            </Link>
          </article>
        </Container>
      </section>
    </InteriorPage>
  );
}
