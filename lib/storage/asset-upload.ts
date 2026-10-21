import { z } from "zod";
import type { createServerSupabaseClient } from "@/lib/supabase/server";
import { COVER_MIME_EXTENSION, isCoverMime, matchesCoverBytes } from "@/lib/storage/covers";
import {
  POST_ASSETS_BUCKET,
  assetFileError,
  assetUploadFailed,
  isPostAssetFileName,
  isPostAssetPath,
  postAssetObjectPath,
  postAssetPublicUrl,
} from "@/lib/storage/assets";

type StorageClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;

export async function uploadPostAsset(supabase: StorageClient, postId: string, file: File) {
  if (!z.uuid().safeParse(postId).success) {
    return { url: null, error: assetUploadFailed };
  }

  const validationError = assetFileError(file);

  if (validationError) {
    return { url: null, error: validationError };
  }

  if (!isCoverMime(file.type)) {
    return { url: null, error: "Bu dosya türü desteklenmiyor." };
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!matchesCoverBytes(bytes, file.type)) {
    return { url: null, error: "Bu dosya türü desteklenmiyor." };
  }

  const { data: post, error: postError } = await supabase.from("posts").select("id").eq("id", postId).maybeSingle();

  if (postError || !post) {
    return { url: null, error: assetUploadFailed };
  }

  const extension = COVER_MIME_EXTENSION[file.type];
  const path = postAssetObjectPath(postId, extension);
  const { error } = await supabase.storage.from(POST_ASSETS_BUCKET).upload(path, new Blob([bytes], { type: file.type }), {
    contentType: file.type,
    upsert: false,
  });

  if (error || !isPostAssetPath(path, postId)) {
    return { url: null, error: assetUploadFailed };
  }

  const url = postAssetPublicUrl(path);

  if (!url) {
    return { url: null, error: assetUploadFailed };
  }

  return { url, error: null };
}

export async function deletePostAssets(supabase: StorageClient, postId: string) {
  if (!z.uuid().safeParse(postId).success) {
    return false;
  }

  const folder = `posts/${postId}`;
  const paths: string[] = [];
  let offset = 0;

  while (offset < 1000) {
    const { data, error } = await supabase.storage.from(POST_ASSETS_BUCKET).list(folder, {
      limit: 100,
      offset,
    });

    if (error) {
      return false;
    }

    if (!data?.length) {
      break;
    }

    data.forEach((file) => {
      if (isPostAssetFileName(file.name)) {
        paths.push(`${folder}/${file.name}`);
      }
    });

    if (data.length < 100) {
      break;
    }

    offset += 100;
  }

  if (paths.length === 0) {
    return true;
  }

  const { error } = await supabase.storage.from(POST_ASSETS_BUCKET).remove(paths);
  return !error;
}
