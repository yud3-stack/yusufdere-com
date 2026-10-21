import { cache } from "react";
import { getAdminPosts } from "@/lib/posts/admin";
import { getAdminProjects } from "@/lib/projects/admin";

// Share the existing reads between the navigation search and overview in one render.
export const getAdminContent = cache(async () => {
  const [posts, projects] = await Promise.all([getAdminPosts(), getAdminProjects()]);
  return { posts, projects };
});
