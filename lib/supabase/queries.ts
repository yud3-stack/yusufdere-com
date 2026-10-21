import { cache } from "react";
import { readingMinutes } from "@/lib/posts/reading";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Category, Post, Project, ProjectSummary } from "@/types/db";

type CategoryRelation = { name: string } | { name: string }[] | null;

export type PublishedPostCard = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "cover_image" | "tags" | "published_at"
> & {
  category_name: string | null;
  reading_minutes: number;
};

export type PublishedPost = Pick<
  Post,
  "id" | "title" | "slug" | "excerpt" | "content" | "cover_image" | "tags" | "published_at"
> & {
  category_name: string | null;
};

function categoryName(value: CategoryRelation) {
  if (!value) {
    return null;
  }

  if (Array.isArray(value)) {
    return value[0]?.name ?? null;
  }

  return value.name;
}

export type QueryResult<T> = { data: T; error: null } | { data: null; error: string };

const missingEnvMessage =
  "Supabase ortam değişkenleri tanımlı değil. NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY gerekli.";

async function getClient() {
  try {
    return { client: await createServerSupabaseClient(), error: null };
  } catch (error) {
    return {
      client: null,
      error: error instanceof Error ? error.message : missingEnvMessage,
    };
  }
}

async function publicClient() {
  try {
    return { client: createPublicSupabaseClient(), error: null };
  } catch (error) {
    return {
      client: null,
      error: error instanceof Error ? error.message : missingEnvMessage,
    };
  }
}

export const getPublishedPosts = cache(async (): Promise<QueryResult<PublishedPostCard[]>> => {
  const { client, error: envError } = await publicClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image, tags, published_at, categories(name)")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) return { data: null, error: "Yazılar şu an yüklenemedi." };

  const posts = (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: (row.excerpt as string | null) ?? null,
    cover_image: (row.cover_image as string | null) ?? null,
    tags: (row.tags as string[] | null) ?? [],
    published_at: (row.published_at as string | null) ?? null,
    category_name: categoryName(row.categories as CategoryRelation),
    reading_minutes: readingMinutes(String(row.content ?? "")),
  }));

  return { data: posts, error: null };
});

export const getPublishedPostBySlug = cache(async (slug: string): Promise<QueryResult<PublishedPost | null>> => {
  const { client, error: envError } = await publicClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("posts")
    .select("id, title, slug, excerpt, content, cover_image, tags, published_at, categories(name)")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) return { data: null, error: "Yazı şu an yüklenemedi." };
  if (!data) return { data: null, error: null };

  return {
    data: {
      id: String(data.id),
      title: String(data.title),
      slug: String(data.slug),
      excerpt: (data.excerpt as string | null) ?? null,
      content: String(data.content ?? ""),
      cover_image: (data.cover_image as string | null) ?? null,
      tags: (data.tags as string[] | null) ?? [],
      published_at: (data.published_at as string | null) ?? null,
      category_name: categoryName(data.categories as CategoryRelation),
    },
    error: null,
  };
});

const projectColumns =
  "id, title, slug, description, cover_image, technologies, github_url, live_url, featured, published_at";

function publishedProject(row: ProjectSummary): ProjectSummary {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    cover_image: (row.cover_image as string | null) ?? null,
    technologies: (row.technologies as string[] | null) ?? [],
    github_url: (row.github_url as string | null) ?? null,
    live_url: (row.live_url as string | null) ?? null,
    featured: Boolean(row.featured),
    published_at: (row.published_at as string | null) ?? null,
  };
}

async function projectsClient() {
  try {
    return { client: createPublicSupabaseClient(["projects"]), error: null };
  } catch (error) {
    return {
      client: null,
      error: error instanceof Error ? error.message : missingEnvMessage,
    };
  }
}

export const getPublishedProjects = cache(async (): Promise<QueryResult<ProjectSummary[]>> => {
  const { client, error: envError } = await projectsClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("projects")
    .select(projectColumns)
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) return { data: null, error: "Projeler şu an yüklenemedi." };
  return { data: ((data ?? []) as ProjectSummary[]).map(publishedProject), error: null };
});

export const getFeaturedProjects = cache(async (): Promise<QueryResult<ProjectSummary[]>> => {
  const { client, error: envError } = await projectsClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("projects")
    .select(projectColumns)
    .eq("status", "published")
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) return { data: null, error: "Projeler şu an yüklenemedi." };
  return { data: ((data ?? []) as ProjectSummary[]).map(publishedProject), error: null };
});

export const getProjectBySlug = cache(async (slug: string): Promise<QueryResult<Project | null>> => {
  const { client, error: envError } = await projectsClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("projects")
    .select(
      "id, title, slug, description, content, cover_image, technologies, github_url, live_url, featured, status, published_at, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) return { data: null, error: "Proje şu an yüklenemedi." };
  if (!data) return { data: null, error: null };

  return {
    data: {
      ...(publishedProject(data as ProjectSummary) as ProjectSummary),
      content: (data.content as string | null) ?? null,
      status: "published",
      created_at: String(data.created_at),
      updated_at: String(data.updated_at),
    },
    error: null,
  };
});

export async function getCategories(): Promise<QueryResult<Category[]>> {
  const { client, error: envError } = await getClient();
  if (!client) return { data: null, error: envError ?? missingEnvMessage };

  const { data, error } = await client
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name", { ascending: true });

  if (error) return { data: null, error: error.message };
  return { data: (data ?? []) as Category[], error: null };
}
