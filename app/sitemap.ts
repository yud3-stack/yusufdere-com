import type { MetadataRoute } from "next";
import { buildSitemap } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { getPublishedPosts, getPublishedProjects } from "@/lib/supabase/queries";

// The existing posts/projects fetch tags also invalidate this sitemap when
// content is published or unpublished. Keep the query's hourly fallback.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);
  if (posts.error || projects.error || !posts.data || !projects.data) {
    throw new Error("Sitemap could not load published content.");
  }
  return buildSitemap(getSiteUrl(), posts.data, projects.data);
}
