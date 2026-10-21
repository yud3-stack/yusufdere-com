import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const BLOG_COVERS_BUCKET = "blog-covers";
export const COVER_MAX_BYTES = 5 * 1024 * 1024;

export const COVER_MIME_EXTENSION = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type CoverMime = keyof typeof COVER_MIME_EXTENSION;

const fileTooLarge = "Dosya 5 MB'dan küçük olmalıdır.";
const unsupportedType = "Bu dosya türü desteklenmiyor.";
export const coverUploadFailed = "Görsel yüklenirken bir hata oluştu.";

export function coverFileError(file: { size: number; type: string }) {
  if (file.size <= 0) {
    return unsupportedType;
  }

  if (file.size > COVER_MAX_BYTES) {
    return fileTooLarge;
  }

  if (!isCoverMime(file.type)) {
    return unsupportedType;
  }

  return null;
}

export function isCoverMime(value: string): value is CoverMime {
  return value in COVER_MIME_EXTENSION;
}

export function coverObjectPath(postId: string, extension: string) {
  return `posts/${postId}/${crypto.randomUUID()}.${extension}`;
}

export function isCoverPathForPost(path: string, postId: string) {
  return new RegExp(`^posts/${postId}/[0-9a-f-]{36}\\.(jpg|png|webp|avif)$`, "i").test(path);
}

export function storagePublicUrl(bucket: string, objectPath: string) {
  const trimmed = objectPath.trim();

  if (!bucket || trimmed.includes("..") || trimmed.includes("\\") || trimmed.startsWith("/")) {
    return null;
  }

  const env = getSupabasePublicEnv();

  if (!env) {
    return null;
  }

  const encoded = trimmed.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `${env.url.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${encoded}`;
}

export function coverImageUrl(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return storagePublicUrl(BLOG_COVERS_BUCKET, trimmed);
}

export function matchesCoverBytes(bytes: Uint8Array, mime: CoverMime) {
  if (mime === "image/jpeg") {
    return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  if (mime === "image/png") {
    const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    return png.every((byte, index) => bytes[index] === byte);
  }

  if (mime === "image/webp") {
    return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP";
  }

  return isAvif(bytes);
}

function isAvif(bytes: Uint8Array) {
  if (ascii(bytes, 4, 4) !== "ftyp") {
    return false;
  }

  const brand = ascii(bytes, 8, 4);

  if (brand === "avif" || brand === "avis") {
    return true;
  }

  const header = ascii(bytes, 8, Math.min(24, Math.max(0, bytes.length - 8)));
  return header.includes("avif") || header.includes("avis");
}

function ascii(bytes: Uint8Array, start: number, length: number) {
  if (bytes.length < start + length) {
    return "";
  }

  return String.fromCharCode(...bytes.slice(start, start + length));
}
