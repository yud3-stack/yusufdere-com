import type { ContentStatus } from "@/types/db";

export function nextPublishedAt(status: ContentStatus, existingPublishedAt: string | null) {
  if (status === "published") {
    return existingPublishedAt ?? new Date().toISOString();
  }

  return existingPublishedAt;
}
