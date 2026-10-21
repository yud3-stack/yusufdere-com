import type { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  BLOG_COVERS_BUCKET,
  COVER_MIME_EXTENSION,
  coverFileError,
  coverObjectPath,
  coverUploadFailed,
  isCoverMime,
  isCoverPathForPost,
  matchesCoverBytes,
} from "@/lib/storage/covers";

type StorageClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export function coverFileFromForm(formData: FormData) {
  const value = formData.get("cover_file");

  if (!(value instanceof File) || value.size === 0) {
    return null;
  }

  return value;
}

export async function inspectCoverFile(file: File) {
  const validationError = coverFileError(file);

  if (validationError || !isCoverMime(file.type)) {
    return { bytes: null, error: validationError ?? "Bu dosya türü desteklenmiyor." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!matchesCoverBytes(bytes, file.type)) {
    return { bytes: null, error: "Bu dosya türü desteklenmiyor." };
  }

  return { bytes, contentType: file.type, error: null };
}

export async function uploadPostCover(supabase: StorageClient, postId: string, file: File) {
  const inspected = await inspectCoverFile(file);

  if (!inspected.bytes || !inspected.contentType) {
    return { path: null, error: inspected.error ?? coverUploadFailed };
  }

  const path = coverObjectPath(postId, COVER_MIME_EXTENSION[inspected.contentType]);
  const { error } = await supabase.storage.from(BLOG_COVERS_BUCKET).upload(path, file, {
    contentType: inspected.contentType,
    upsert: false,
  });

  if (error || !isCoverPathForPost(path, postId)) {
    return { path: null, error: coverUploadFailed };
  }

  return { path, error: null };
}

export async function deletePostCover(supabase: StorageClient, postId: string, path: string | null) {
  if (!path || !isCoverPathForPost(path, postId)) {
    return true;
  }

  const { error } = await supabase.storage.from(BLOG_COVERS_BUCKET).remove([path]);
  return !error;
}
