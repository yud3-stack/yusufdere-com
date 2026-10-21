import { PostCard } from "@/components/blog/post-card";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getPublishedPosts } from "@/lib/supabase/queries";

export async function LatestPosts() {
  const result = await getPublishedPosts();
  const posts = result.data?.slice(0, 4) ?? [];
  const [featured, ...rest] = posts;

  return (
    <section id="son-yazilar" className="home-section">
      <Container>
        <SectionHeading title="Son Yazılar" href="/blog" label="Tüm Yazılar" />
        {result.error ? <p className="content-state">Yazılar şu an yüklenemedi.</p> : null}
        {!result.error && !posts.length ? <p className="content-state">Henüz yayınlanmış bir yazı yok.</p> : null}
        {featured && rest.length > 0 ? (
          <div className="latest-layout">
            <PostCard post={featured} variant="featured" headingLevel={3} />
            <div className="latest-list">
              {rest.map(post => <PostCard key={post.id} post={post} variant="horizontal" headingLevel={3} />)}
            </div>
          </div>
        ) : featured ? <PostCard post={featured} variant="wide" headingLevel={3} /> : null}
      </Container>
    </section>
  );
}
