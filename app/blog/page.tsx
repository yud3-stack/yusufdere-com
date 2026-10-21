import type { Metadata } from "next";
import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { getSiteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/supabase/queries";

const title = "Blog";
const description = "Yazılım geliştirme, web teknolojileri, projeler ve öğrendiklerim üzerine yazılar.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/blog` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/blog`,
    type: "website",
  },
};

export default async function BlogPage() {
  const result = await getPublishedPosts();
  const posts = result.data ?? [];

  return (
    <Container>
      <PageIntro eyebrow="YAZILAR" title="Yazdıklarım." description="Karşılaştığım problemler, kullandığım teknolojiler ve geliştirdiğim projeler üzerine notlar." />
      <div className="archive-content">
        {result.error ? <p className="content-state">Yazılar şu an yüklenemedi.</p> : null}
        {!result.error && !posts.length ? <p className="content-state">Henüz yayınlanmış bir yazı yok.</p> : null}
        {posts.length > 0 ? (
          <div className={`archive-posts ${posts.length === 1 ? "single" : ""}`}>
            {posts.map(post => <PostCard key={post.id} post={post} variant={posts.length === 1 ? "wide" : "default"} />)}
          </div>
        ) : null}
      </div>
    </Container>
  );
}
