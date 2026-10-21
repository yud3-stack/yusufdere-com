import type { ContentBlock } from "@/types/content";

export type PostInput = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  category: string;
  coverImage: string;
  publishedAt: string;
  featured: boolean;
};

export const posts: PostInput[] = [];
