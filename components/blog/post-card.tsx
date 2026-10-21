import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PostMeta } from "@/components/blog/PostMeta";
import { CoverImage } from "@/components/content/cover-image";
import { coverImageUrl } from "@/lib/storage/covers";
import type { PublishedPostCard } from "@/lib/supabase/queries";

type PostCardProps = {
  post: PublishedPostCard;
  variant?: "default" | "featured" | "horizontal" | "wide";
  headingLevel?: 2 | 3;
};

export function PostCard({ post, variant = "default", headingLevel = 2 }: PostCardProps) {
  const cover = coverImageUrl(post.cover_image);
  const Heading = headingLevel === 3 ? "h3" : "h2";

  return (
    <article className={`post-card post-${variant} ${cover ? "has-cover" : "no-cover"}`}>
      <Link href={`/blog/${post.slug}`} className="post-link group">
        <CoverImage
          src={cover}
          alt={post.title}
          className="post-cover"
          sizes={variant === "horizontal" ? "(min-width: 768px) 170px, 110px" : "(min-width: 1280px) 580px, (min-width: 768px) 50vw, 100vw"}
        />
        <div className="post-copy">
          {post.category_name ? <span className="category-label">{post.category_name}</span> : null}
          <Heading>{post.title}</Heading>
          {post.excerpt ? <p className="post-excerpt">{post.excerpt}</p> : null}
          <div className="post-bottom">
            <PostMeta date={post.published_at} minutes={post.reading_minutes} />
            <span className="card-arrow"><ArrowUpRight size={19} aria-hidden="true" /><span className="sr-only">Yazıyı oku</span></span>
          </div>
        </div>
      </Link>
    </article>
  );
}
