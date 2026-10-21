"use server";

import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { mapWriteError } from "@/lib/posts/errors";
import { nextPublishedAt } from "@/lib/posts/publish";
import { parseProjectForm } from "@/lib/projects/validation";
import { coverUploadFailed } from "@/lib/storage/covers";
import { coverFileFromForm, inspectCoverFile } from "@/lib/storage/cover-upload";
import { deleteProjectCover, uploadProjectCover } from "@/lib/storage/project-covers";
import type { ContentStatus } from "@/types/db";

export type ProjectActionState = {
  error: string | null;
  message: string | null;
  status: ContentStatus;
};

function refreshProjectPaths(id?: string) {
  revalidatePath("/admin/projects");

  if (id) {
    revalidatePath(`/admin/projects/${id}/edit`);
  }
}

function refreshPublishedProjects(slug?: string | null, previousSlug?: string | null) {
  updateTag("projects");
  revalidatePath("/");
  revalidatePath("/projects");

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }

  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/projects/${previousSlug}`);
  }
}

export async function saveProject(
  _previous: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const admin = await requireAdmin();
  const requestedStatus: ContentStatus = formData.get("status") === "published" ? "published" : "draft";

  if (!admin.ok) {
    return { error: admin.error, message: null, status: requestedStatus };
  }

  const parsed = parseProjectForm(formData);

  if (!parsed.data) {
    return { error: parsed.error, message: null, status: requestedStatus };
  }

  const id = String(formData.get("id") ?? "").trim();
  const input = parsed.data;
  const payload = {
    title: input.title,
    slug: input.slug,
    description: input.description,
    content: input.content,
    technologies: input.technologies,
    github_url: input.githubUrl,
    live_url: input.liveUrl,
    featured: input.featured,
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
      .from("projects")
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

    const projectId = String(data.id);

    if (coverFile) {
      const uploaded = await uploadProjectCover(admin.supabase, projectId, coverFile);

      if (!uploaded.path) {
        await admin.supabase.from("projects").delete().eq("id", projectId);
        return { error: uploaded.error ?? coverUploadFailed, message: null, status: input.status };
      }

      const { error: coverError } = await admin.supabase
        .from("projects")
        .update({ cover_image: uploaded.path })
        .eq("id", projectId);

      if (coverError) {
        await deleteProjectCover(admin.supabase, projectId, uploaded.path);
        await admin.supabase.from("projects").delete().eq("id", projectId);
        return { error: coverUploadFailed, message: null, status: input.status };
      }
    }

    refreshProjectPaths(projectId);
    refreshPublishedProjects(input.slug);
    redirect(`/admin/projects/${projectId}/edit?saved=1`);
  }

  if (!z.uuid().safeParse(id).success) {
    return { error: "Proje bulunamadı.", message: null, status: input.status };
  }

  const { data: existing, error: existingError } = await admin.supabase
    .from("projects")
    .select("published_at, cover_image, slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { error: "Proje yüklenemedi.", message: null, status: input.status };
  }

  if (!existing) {
    return { error: "Proje bulunamadı.", message: null, status: input.status };
  }

  const currentCover = (existing.cover_image as string | null) ?? null;
  const removeCover = formData.get("remove_cover") === "1" && !coverFile;
  let nextCover = currentCover;
  let uploadedPath: string | null = null;

  if (coverFile) {
    const uploaded = await uploadProjectCover(admin.supabase, id, coverFile);

    if (!uploaded.path) {
      return { error: uploaded.error ?? coverUploadFailed, message: null, status: input.status };
    }

    uploadedPath = uploaded.path;
    nextCover = uploaded.path;
  } else if (removeCover) {
    nextCover = null;
  }

  const { error } = await admin.supabase
    .from("projects")
    .update({
      ...payload,
      cover_image: nextCover,
      published_at: nextPublishedAt(input.status, (existing.published_at as string | null) ?? null),
    })
    .eq("id", id);

  if (error) {
    if (uploadedPath) {
      await deleteProjectCover(admin.supabase, id, uploadedPath);
    }

    return { error: mapWriteError(error), message: null, status: input.status };
  }

  if (currentCover && currentCover !== nextCover) {
    const removed = await deleteProjectCover(admin.supabase, id, currentCover);

    if (!removed) {
      refreshProjectPaths(id);
      refreshPublishedProjects(input.slug, existing.slug as string | null);
      return {
        error: null,
        message: "Proje kaydedildi. Eski görsel depodan silinemedi.",
        status: input.status,
      };
    }
  }

  refreshProjectPaths(id);
  refreshPublishedProjects(input.slug, existing.slug as string | null);
  return { error: null, message: "Proje kaydedildi.", status: input.status };
}

export async function deleteProject(
  _previous: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { error: admin.error, message: null, status: "draft" };
  }

  const id = String(formData.get("id") ?? "").trim();

  if (!z.uuid().safeParse(id).success) {
    return { error: "Proje bulunamadı.", message: null, status: "draft" };
  }

  const { data: existing, error: existingError } = await admin.supabase
    .from("projects")
    .select("cover_image, slug")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    return { error: "Proje bulunamadı.", message: null, status: "draft" };
  }

  const { data, error } = await admin.supabase.from("projects").delete().eq("id", id).select("id");

  if (error) {
    return { error: mapWriteError(error), message: null, status: "draft" };
  }

  if (!data?.length) {
    return { error: "Proje bulunamadı.", message: null, status: "draft" };
  }

  await deleteProjectCover(admin.supabase, id, (existing?.cover_image as string | null) ?? null);
  refreshProjectPaths();
  refreshPublishedProjects((existing?.slug as string | null) ?? null);
  return { error: null, message: null, status: "draft" };
}
