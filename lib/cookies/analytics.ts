export type AnalyticsProvider = "plausible" | "umami" | "ga4";

export type AnalyticsConfig =
  | { provider: "plausible"; domain: string; src: string }
  | { provider: "umami"; websiteId: string; src: string }
  | { provider: "ga4"; measurementId: string }
  | null;

function trim(value: string | undefined) {
  return value?.trim() || "";
}

export function getAnalyticsConfig(): AnalyticsConfig {
  const provider = trim(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER).toLowerCase();

  if (provider === "plausible") {
    const domain = trim(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
    if (!domain) return null;
    return {
      provider: "plausible",
      domain,
      src: trim(process.env.NEXT_PUBLIC_PLAUSIBLE_SRC) || "https://plausible.io/js/script.js",
    };
  }

  if (provider === "umami") {
    const websiteId = trim(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID);
    const src = trim(process.env.NEXT_PUBLIC_UMAMI_SRC);
    if (!websiteId || !src) return null;
    return { provider: "umami", websiteId, src };
  }

  if (provider === "ga4") {
    const measurementId = trim(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
    if (!/^G-[A-Z0-9]+$/.test(measurementId)) return null;
    return { provider: "ga4", measurementId };
  }

  return null;
}

export function analyticsProviderLabel(config: AnalyticsConfig) {
  if (!config) return null;
  if (config.provider === "plausible") return "Plausible";
  if (config.provider === "umami") return "Umami";
  return "Google Analytics 4";
}
