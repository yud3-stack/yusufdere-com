"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { mapWriteError } from "@/lib/posts/errors";
import { nextPublishedAt } from "@/lib/posts/publish";
import { slugify } from "@/lib/posts/slug";
import { parseCategoryName, parsePostForm } from "@/lib/posts/validation";
import { coverUploadFailed } from "@/lib/storage/covers";
import { deletePostAssets } from "@/lib/storage/asset-upload";
import { coverFileFromForm, deletePostCover, inspectCoverFile, uploadPostCover } from "@/lib/storage/cover-upload";
import type { Category, ContentStatus } from "@/types/db";

export type PostActionState = {
  error: string | null;
  message: string | null;
  status: ContentStatus;
};

function refreshPostPaths(id?: string) {
  revalidatePath("/admin/posts");

  if (id) {
    revalidatePath(`/admin/posts/${id}/edit`);
  }
}

function refreshPublishedContent(slug?: string | null, previousSlug?: string | null) {
  updateTag("posts");
  revalidatePath("/");
  revalidatePath("/blog");

  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/blog/${previousSlug}`);
  }
}

export async function savePost(
  _previous: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const admin = await requireAdmin();

  const requestedStatus: ContentStatus = formData.get("status") === "published" ? "published" : "draft";

  if (!admin.ok) {
    return { error: admin.error, message: null, status: requestedStatus };
  }

  const parsed = parsePostForm(formData);

  if (!parsed.data) {
    return { error: parsed.error, message: null, status: requestedStatus };
  }

  const id = String(formData.get("id") ?? "").trim();
  const input = parsed.data;
  const payload = {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    category_id: input.categoryId,
    tags: input.tags,
    status: input.status,
  };
  const coverFile = coverFileFromForm(formData);

  if (!id) {
    if (coverFile) {
      const inspected = await inspectCoverFile(coverFile);

      if (!inspected.bytes) {
        return { error: inspected.error ?? coverUploadFailed, message: null, status: input.status };
      }
    }

    const { data, error } = await admin.supabase
      .from("posts")
      .insert({
        ...payload,
        cover_image: null,
        published_at: nextPublishedAt(input.status, null),
      })
      .select("id")
      .single();

    if (error || !data) {
      return { error: mapWriteError(error ?? {}), message: null, status: input.status };
    }

    const postId = String(data.id);

    if (coverFile) {
      const uploaded = await uploadPostCover(admin.supabase, postId, coverFile);

      if (!uploaded.path) {
        await admin.supabase.from("posts").delete().eq("id", postId);
        return { error: uploaded.error ?? coverUploadFailed, message: null, status: input.status };
      }

      const { error: coverError } = await admin.supabase
        .from("posts")
        .update({ cover_image: uploaded.path })
        .eq("id", postId);

      if (coverError) {
        await deletePostCover(admin.supabase, postId, uploaded.path);
        await admin.supabase.from("posts").delete().eq("id", postId);
        return { error: coverUploadFailed, message: null, status: input.status };
      }
    }

    refreshPostPaths(postId);
    refreshPublishedContent(input.slug);
    redirect(`/admin/posts/${postId}/edit?saved=1`);
  }

  if (!z.uuid().safeParse(id).success) {
    return { error: "Yazı bulunamadı.", message: null, status: input.status };
  }

  const { data: existing, error: existingError } = await admin.supabase
    .from("posts")
    .select("published_at, cover_image, slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { error: "Yazı yüklenemedi.", message: null, status: input.status };
  }

  if (!existing) {
    return { error: "Yazı bulunamadı.", message: null, status: input.status };
  }

  const currentCover = (existing.cover_image as string | null) ?? null;
  const removeCover = formData.get("remove_cover") === "1" && !coverFile;
  let nextCover = currentCover;
  let uploadedPath: string | null = null;

  if (coverFile) {
    const uploaded = await uploadPostCover(admin.supabase, id, coverFile);

    if (!uploaded.path) {
      return { error: uploaded.error ?? coverUploadFailed, message: null, status: input.status };
    }

    uploadedPath = uploaded.path;
    nextCover = uploaded.path;
  } else if (removeCover) {
    nextCover = null;
  }

  const { error } = await admin.supabase
    .from("posts")
    .update({
      ...payload,
      cover_image: nextCover,
      published_at: nextPublishedAt(input.status, (existing.published_at as string | null) ?? null),
    })
    .eq("id", id);

  if (error) {
    if (uploadedPath) {
      await deletePostCover(admin.supabase, id, uploadedPath);
    }

    return { error: mapWriteError(error), message: null, status: input.status };
  }

  if (currentCover && currentCover !== nextCover) {
    const removed = await deletePostCover(admin.supabase, id, currentCover);

    if (!removed) {
      refreshPostPaths(id);
      refreshPublishedContent(input.slug, existing.slug as string | null);
      return {
        error: null,
        message: "Yazı kaydedildi. Eski görsel depodan silinemedi.",
        status: input.status,
      };
    }
  }

  refreshPostPaths(id);
  refreshPublishedContent(input.slug, existing.slug as string | null);
  return { error: null, message: "Yazı kaydedildi.", status: input.status };
}

export async function deletePost(
  _previous: PostActionState,
  formData: FormData,
): Promise<PostActionState> {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { error: admin.error, message: null, status: "draft" };
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!z.uuid().safeParse(id).success) {
    return { error: "Yazı bulunamadı.", message: null, status: "draft" };
  }

  const { data: existing, error: existingError } = await admin.supabase
    .from("posts")
    .select("cover_image, slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { error: "Yazı bulunamadı.", message: null, status: "draft" };
  }

  const { data, error } = await admin.supabase.from("posts").delete().eq("id", id).select("id");

  if (error) {
    return { error: mapWriteError(error), message: null, status: "draft" };
  }

  if (!data?.length) {
    return { error: "Yazı bulunamadı.", message: null, status: "draft" };
  }

  await deletePostCover(admin.supabase, id, (existing?.cover_image as string | null) ?? null);
  await deletePostAssets(admin.supabase, id);
  refreshPostPaths();
  refreshPublishedContent((existing?.slug as string | null) ?? null);
  return { error: null, message: null, status: "draft" };
}

export async function createDraftForImage(formData: FormData): Promise<{ id: string } | { error: string }> {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { error: admin.error };
  }

  if (!String(formData.get("title") ?? "").trim()) {
    return { error: "Yazıya görsel eklemeden önce başlık gir." };
  }

  formData.set("status", "draft");
  const parsed = parsePostForm(formData);

  if (!parsed.data) {
    return { error: parsed.error };
  }

  const input = parsed.data;
  const { data, error } = await admin.supabase
    .from("posts")
    .insert({
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt,
      content: input.content,
      cover_image: null,
      category_id: input.categoryId,
      tags: input.tags,
      status: "draft",
      published_at: null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: mapWriteError(error ?? {}) };
  }

  const postId = String(data.id);
  refreshPostPaths(postId);
  refreshPublishedContent(input.slug);
  return { id: postId };
}

export async function createCategory(name: string): Promise<{ category: Category } | { error: string }> {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { error: admin.error };
  }

  const parsed = parseCategoryName(name);

  if (!parsed.name) {
    return { error: parsed.error ?? "Kategori geçersiz." };
  }

  const slug = slugify(parsed.name);

  if (!slug) {
    return { error: "Kategori adından bir slug üretilemedi." };
  }

  const { data, error } = await admin.supabase
    .from("categories")
    .insert({ name: parsed.name, slug })
    .select("id, name, slug, created_at")
    .single();

  if (error || !data) {
    return { error: mapWriteError(error ?? {}) };
  }

  return { category: data as Category };
}
