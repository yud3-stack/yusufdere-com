"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { uploadPostAsset } from "@/lib/storage/asset-upload";
import { assetUploadFailed } from "@/lib/storage/assets";

export async function uploadInlineImage(formData: FormData) {
  const admin = await requireAdmin();

  if (!admin.ok) {
    return { error: admin.error };
  }

  const postId = String(formData.get("postId") ?? "").trim();
  const file = formData.get("file");

  if (!z.uuid().safeParse(postId).success || !(file instanceof File)) {
    return { error: assetUploadFailed };
  }

  const uploaded = await uploadPostAsset(admin.supabase, postId, file);

  if (!uploaded.url) {
    return { error: uploaded.error ?? assetUploadFailed };
  }

  return { url: uploaded.url };
}
