export const locales = ["en", "tr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "tr";
}

export function stripLocalePrefix(path: string) {
  if (path === "/tr") {
    return "/";
  }

  if (path.startsWith("/tr/")) {
    return path.slice(3) || "/";
  }

  return path || "/";
}

export function withLocalePrefix(path: string, locale: Locale = defaultLocale) {
  if (
    path.startsWith("http") ||
    path.startsWith("mailto:") ||
    path.startsWith("#")
  ) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const unprefixedPath = stripLocalePrefix(normalizedPath);

  if (locale === defaultLocale) {
    return unprefixedPath;
  }

  return unprefixedPath === "/" ? "/tr" : `/tr${unprefixedPath}`;
}
