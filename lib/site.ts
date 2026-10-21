const fallbackSiteUrl = "https://www.yusufdere.com";

export function getSiteUrl() {
  const url = new URL(process.env.NEXT_PUBLIC_SITE_URL?.trim() || fallbackSiteUrl);
  // Production redirects to www; metadata must point directly at that destination.
  if (url.hostname === "yusufdere.com" || url.hostname === "www.yusufdere.com") {
    return fallbackSiteUrl;
  }
  return url.origin;
}
