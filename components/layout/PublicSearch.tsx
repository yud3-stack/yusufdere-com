import { SearchClient, type SearchItem } from "@/components/layout/SearchClient";
import { getPublishedPosts, getPublishedProjects } from "@/lib/supabase/queries";

export async function PublicSearch() {
  const [posts, projects] = await Promise.all([getPublishedPosts(), getPublishedProjects()]);
  const items: SearchItem[] = [
    ...(posts.data ?? []).map(post => ({
      href: `/blog/${post.slug}`,
      title: post.title,
      kind: "Yazı" as const,
      keywords: [post.excerpt, post.category_name, ...post.tags].filter(Boolean).join(" "),
    })),
    ...(projects.data ?? []).map(project => ({
      href: `/projects/${project.slug}`,
      title: project.title,
      kind: "Proje" as const,
      keywords: [project.description, ...project.technologies].join(" "),
    })),
  ];

  return <SearchClient items={items} unavailable={Boolean(posts.error || projects.error)} />;
}
