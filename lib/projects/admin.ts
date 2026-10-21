import { requireAdmin } from "@/lib/auth/require-admin";
import type { ContentStatus, Project } from "@/types/db";

export type AdminProjectListItem = {
  id: string;
  title: string;
  status: ContentStatus;
  featured: boolean;
  cover_image: string | null;
  published_at: string | null;
  updated_at: string;
};

export async function getAdminProjects() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { data: null, error: admin.error };
  }

  const { data, error } = await admin.supabase
    .from("projects")
    .select("id, title, status, featured, cover_image, published_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: null, error: "Projeler yüklenemedi." };
  }

  const projects: AdminProjectListItem[] = (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    status: row.status as ContentStatus,
    featured: Boolean(row.featured),
    cover_image: (row.cover_image as string | null) ?? null,
    published_at: (row.published_at as string | null) ?? null,
    updated_at: String(row.updated_at),
  }));

  return { data: projects, error: null };
}

export async function getAdminProject(id: string) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { project: null, error: admin.error };
  }

  const { data, error } = await admin.supabase
    .from("projects")
    .select(
      "id, title, slug, description, content, cover_image, technologies, github_url, live_url, featured, status, published_at, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return { project: null, error: "Proje yüklenemedi." };
  }

  return { project: (data as Project | null) ?? null, error: null };
}
