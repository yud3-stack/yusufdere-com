import { requireAdmin } from "@/lib/auth/require-admin";
import type { Category, ContentStatus, Post } from "@/types/db";

export type AdminPostListItem = {
  id: string;
  title: string;
  status: ContentStatus;
  published_at: string | null;
  updated_at: string;
  category_name: string | null;
};

type CategoryRelation = { name: string } | { name: string }[] | null;

function categoryName(value: CategoryRelation) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0]?.name ?? null;
  }

  return value.name;
}

export async function getAdminPosts() {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { data: null, error: admin.error };
  }

  const { data, error } = await admin.supabase
    .from("posts")
    .select("id, title, status, published_at, updated_at, categories(name)")
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: null, error: "Yazılar yüklenemedi." };
  }

  const posts: AdminPostListItem[] = (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    status: row.status as ContentStatus,
    published_at: (row.published_at as string | null) ?? null,
    updated_at: String(row.updated_at),
    category_name: categoryName(row.categories as CategoryRelation),
  }));

  return { data: posts, error: null };
}

export async function getAdminEditor(id: string | null) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { post: null, categories: null, error: admin.error };
  }

  const categoriesQuery = admin.supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  const postQuery = id
    ? admin.supabase
        .from("posts")
        .select(
          "id, title, slug, excerpt, content, cover_image, category_id, tags, status, published_at, created_at, updated_at",
        )
        .eq("id", id)
        .maybeSingle()
    : Promise.resolve({ data: null, error: null });

  const [postResult, categoryResult] = await Promise.all([postQuery, categoriesQuery]);

  if (postResult.error || categoryResult.error) {
    return { post: null, categories: null, error: "Yazı formu yüklenemedi." };
  }

  return {
    post: (postResult.data as Post | null) ?? null,
    categories: (categoryResult.data ?? []) as Category[],
    error: null,
  };
}
