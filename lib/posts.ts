import { posts as postInputs } from "@/data/posts";
import type { ContentBlock } from "@/types/content";
import type { Post } from "@/types/post";

function wordCount(blocks: ContentBlock[]) {
  const text = blocks
    .map((block) => {
      if (block.type === "list") return block.items.join(" ");
      if (block.type === "code") return block.code;
      if (block.type === "image") return block.alt;
      return block.text;
    })
    .join(" ");

  return text.split(/\s+/).filter(Boolean).length;
}

function withReadingTime(post: (typeof postInputs)[number]): Post {
  return {
    ...post,
    readingTime: Math.max(1, Math.ceil(wordCount(post.content) / 180)),
  };
}

function byDateDesc(a: Post, b: Post) {
  return a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0;
}

export function getPosts(): Post[] {
  return postInputs.map(withReadingTime).sort(byDateDesc);
}

export function getFeaturedPosts(): Post[] {
  const featured = getPosts().filter((post) => post.featured);
  return featured.length > 0 ? featured : getPosts().slice(0, 1);
}

export function getRecentPosts(limit = 4): Post[] {
  return getPosts().slice(0, limit);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPosts().find((post) => post.slug === slug);
}

export type PostSearchItem = Pick<
  Post,
  "title" | "slug" | "excerpt" | "category" | "coverImage" | "publishedAt" | "readingTime"
>;

export function getPostSearchItems(): PostSearchItem[] {
  return getPosts().map(
    ({ title, slug, excerpt, category, coverImage, publishedAt, readingTime }) => ({
      title,
      slug,
      excerpt,
      category,
      coverImage,
      publishedAt,
      readingTime,
    }),
  );
}
