import type { MetadataRoute } from "next";

import { getAllJournalPosts, getAllProjects } from "@/lib/sanity/data";
import { absoluteUrl } from "@/lib/seo";

const staticRoutes = [
  "/",
  "/about",
  "/projects",
  "/journal",
  "/gallery",
  "/uses",
  "/now",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, journalPosts] = await Promise.all([
    getAllProjects(),
    getAllJournalPosts(),
  ]);

  const dynamicRoutes = [
    ...projects.map((project) => project.href),
    ...journalPosts.map((post) => post.href),
  ].filter((href) => href.startsWith("/"));

  const routes = Array.from(new Set([...staticRoutes, ...dynamicRoutes]));
  const now = new Date();

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.includes("/", 1) ? 0.7 : 0.8,
  }));
}
