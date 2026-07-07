import type { MetadataRoute } from "next";

import { withLocalePrefix } from "@/lib/locale";
import { getAllJournalPosts, getAllProjects } from "@/lib/sanity/data";
import { absoluteUrl, languageAlternates } from "@/lib/seo";

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

const turkishStaticRoutes = [
  "/tr",
  "/tr/about",
  "/tr/projects",
  "/tr/journal",
  "/tr/gallery",
  "/tr/uses",
  "/tr/now",
  "/tr/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, journalPosts] = await Promise.all([
    getAllProjects(),
    getAllJournalPosts(),
  ]);

  const dynamicRoutes = [
    ...projects.map((project) => project.href),
    ...projects.map((project) => withLocalePrefix(project.href, "tr")),
    ...journalPosts.map((post) => post.href),
    ...journalPosts.map((post) => withLocalePrefix(post.href, "tr")),
  ].filter((href) => href.startsWith("/"));

  const routes = Array.from(
    new Set([...staticRoutes, ...turkishStaticRoutes, ...dynamicRoutes]),
  );
  const now = new Date();

  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: now,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : route.includes("/", 1) ? 0.7 : 0.8,
    alternates: {
      languages: languageAlternates(route),
    },
  }));
}
