import type { ContentBlock } from "@/types/content";

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  category: string;
  coverImage: string;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
};
