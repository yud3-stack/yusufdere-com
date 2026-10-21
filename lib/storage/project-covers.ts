import type { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  COVER_MIME_EXTENSION,
  coverUploadFailed,
  storagePublicUrl,
} from "@/lib/storage/covers";
import { inspectCoverFile } from "@/lib/storage/cover-upload";

export const PROJECT_COVERS_BUCKET = "project-covers";

type StorageClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export function projectCoverObjectPath(projectId: string, extension: string) {
  return `projects/${projectId}/${crypto.randomUUID()}.${extension}`;
}

export function isProjectCoverPath(path: string, projectId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId)) {
    return false;
  }

  return new RegExp(`^projects/${projectId}/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`, "i").test(path);
}

export function projectCoverImageUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return storagePublicUrl(PROJECT_COVERS_BUCKET, trimmed);
}

export async function uploadProjectCover(supabase: StorageClient, projectId: string, file: File) {
  const inspected = await inspectCoverFile(file);

  if (!inspected.bytes || !inspected.contentType) {
    return { path: null, error: inspected.error ?? coverUploadFailed };
  }

  const path = projectCoverObjectPath(projectId, COVER_MIME_EXTENSION[inspected.contentType]);
  const { error } = await supabase.storage.from(PROJECT_COVERS_BUCKET).upload(path, inspected.bytes, {
    contentType: inspected.contentType,
    upsert: false,
  });

  if (error || !isProjectCoverPath(path, projectId)) {
    return { path: null, error: coverUploadFailed };
  }

  return { path, error: null };
}

export async function deleteProjectCover(supabase: StorageClient, projectId: string, path: string | null) {
  if (!path || !isProjectCoverPath(path, projectId)) {
    return true;
  }

  const { error } = await supabase.storage.from(PROJECT_COVERS_BUCKET).remove([path]);
  return !error;
}
