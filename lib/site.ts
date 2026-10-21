const fallbackSiteUrl = "https://yusufdere.com";

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!configured) {
    return fallbackSiteUrl;
  }

  return configured.replace(/\/$/, "");
}
