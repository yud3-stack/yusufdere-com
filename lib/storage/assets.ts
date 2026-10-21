import { COVER_MAX_BYTES, isCoverMime, storagePublicUrl } from "@/lib/storage/covers";

export const POST_ASSETS_BUCKET = "post-assets";

const unsupportedType = "Bu dosya türü desteklenmiyor.";
const fileTooLarge = "Görsel 5 MB'dan küçük olmalıdır.";
export const assetUploadFailed = "Görsel yüklenirken bir hata oluştu.";

export function assetFileError(file: { size: number; type: string }) {
  if (file.size <= 0 || !isCoverMime(file.type)) {
    return unsupportedType;
  }

  if (file.size > COVER_MAX_BYTES) {
    return fileTooLarge;
  }

  return null;
}

export function postAssetObjectPath(postId: string, extension: string) {
  return `posts/${postId}/${crypto.randomUUID()}.${extension}`;
}

export function isPostAssetPath(path: string, postId: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId)) {
    return false;
  }

  return new RegExp(`^posts/${postId}/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`, "i").test(path);
}

export function isPostAssetFileName(name: string) {
  return /^[0-9a-f-]{36}\.(jpg|png|webp|avif)$/i.test(name);
}

export function postAssetPublicUrl(path: string) {
  return storagePublicUrl(POST_ASSETS_BUCKET, path);
}

export function markdownImage(url: string, alt: string, caption = "") {
  const safeAlt = alt.replace(/[\[\]]/g, "").trim();
  const safeCaption = caption.replace(/"/g, "'").trim();

  if (safeCaption) {
    return `![${safeAlt}](${url} "${safeCaption}")`;
  }

  return `![${safeAlt}](${url})`;
}
