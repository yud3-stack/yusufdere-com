import type { Metadata } from "next";
import { BlogScene } from "@/components/blog/BlogScene";
import { journalArtwork } from "@/data/journal";
import { coverImageUrl } from "@/lib/storage/covers";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";
import { getPublishedPosts } from "@/lib/supabase/queries";

const title = "Yazılar";
const description =
  "Yazılım geliştirme, web teknolojileri, projeler ve öğrendiklerim üzerine yazılar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/blog` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/blog`,
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

export default async function BlogPage() {
  const result = await getPublishedPosts();
  const posts = result.data ?? [];

  return (
    <BlogScene
      error={!!result.error}
      posts={posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        cover: journalArtwork[post.slug] ?? coverImageUrl(post.cover_image),
        category: post.category_name,
        publishedAt: post.published_at,
        minutes: post.reading_minutes,
      }))}
    />
  );
}
