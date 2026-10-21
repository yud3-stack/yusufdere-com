import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoverImage } from "@/components/content/cover-image";
import { Markdown } from "@/components/content/markdown";
import { Container } from "@/components/layout/Container";
import { BackLink } from "@/components/layout/PageIntro";
import { PostMeta } from "@/components/blog/PostMeta";
import { TechnologyBadge } from "@/components/projects/TechnologyBadge";
import { readingMinutes } from "@/lib/posts/reading";
import { getSiteUrl } from "@/lib/site";
import { JsonLd } from "@/components/content/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/seo";
import { coverImageUrl } from "@/lib/storage/covers";
import { getPublishedPostBySlug, getPublishedPosts } from "@/lib/supabase/queries";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const result = await getPublishedPosts();

  return (result.data ?? []).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (result.error) {
    return { title: "Blog", robots: { index: false, follow: false } };
  }

  if (!result.data) {
    notFound();
  }

  const post = result.data;
  const description = post.excerpt?.trim() || "Yusuf Dere tarafından paylaşılan bir yazı.";
  const url = `${getSiteUrl()}/blog/${post.slug}`;
  const image = coverImageUrl(post.cover_image);

  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      publishedTime: post.published_at ?? undefined,
      images: image ? [{ url: image, alt: post.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: post.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPublishedPostBySlug(slug);

  if (result.error) {
    return (
      <Container className="py-16">
        <p className="text-sm text-[#9CA3AF]">Yazı şu an yüklenemedi.</p>
      </Container>
    );
  }

  if (!result.data) {
    notFound();
  }

  const post = result.data;
  const cover = coverImageUrl(post.cover_image);
  const minutes = readingMinutes(post.content);

  return (
    <Container className="detail-page">
      <JsonLd data={blogPostingSchema(getSiteUrl(), post, cover)} />
      <JsonLd data={breadcrumbSchema(getSiteUrl(), [
        { name: "Ana Sayfa", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${encodeURIComponent(post.slug)}` },
      ])} />
      <article className="detail-article blog-article">
        <BackLink href="/blog" label="Blog" />
        <header className="detail-heading">
          {post.category_name ? <span className="category-label">{post.category_name}</span> : null}
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="detail-description">{post.excerpt}</p> : null}
          <PostMeta date={post.published_at} minutes={minutes} />
          {post.tags.length > 0 ? (
            <ul className="tag-list">{post.tags.map(tag => <li key={tag}><TechnologyBadge name={tag} /></li>)}</ul>
          ) : null}
        </header>
        <CoverImage src={cover} alt={post.title} className="detail-cover" sizes="(min-width: 768px) 760px, 100vw" priority />
        <div className="article-body">
          <Markdown markdown={post.content} variant="article" className="blog-prose min-w-0" />
        </div>
      </article>
    </Container>
  );
}
