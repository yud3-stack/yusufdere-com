import type { Metadata } from "next";

import {
  defaultLocale,
  stripLocalePrefix,
  type Locale,
  withLocalePrefix,
} from "@/lib/locale";

export const siteUrl = "https://yusufdere.com";
export const ogImagePath = "/images/og/yusufdere-og.png";

export const defaultSeo = {
  siteName: "Yusuf Dere",
  title: "Yusuf Dere",
  description: "Software, products, notes and photography from Samsun.",
  locale: "en_US",
} as const;

export const localizedSeo = {
  en: {
    locale: "en_US",
    homeDescription: defaultSeo.description,
    projectsDescription:
      "Products, experiments and software projects Yusuf Dere is building.",
    journalDescription:
      "Short notes, development logs and behind-the-scenes thoughts from Yusuf Dere.",
    galleryDescription:
      "Selected lifestyle, travel, workspace and photography moments from Yusuf Dere.",
    usesDescription:
      "Devices, software and everyday workflow tools used by Yusuf Dere.",
    nowDescription:
      "Current projects, focus areas and priorities from Yusuf Dere.",
    contactDescription: "Contact Yusuf Dere through Instagram or email.",
  },
  tr: {
    locale: "tr_TR",
    homeDescription:
      "Samsun'dan yazılım, dijital ürünler, notlar ve fotoğraf kareleri.",
    projectsDescription:
      "Yusuf Dere'nin üzerinde çalıştığı ürünler, deneyler ve yazılım projeleri.",
    journalDescription:
      "Kısa notlar, geliştirme günlükleri ve üretim sürecinden düşünceler.",
    galleryDescription:
      "Yaşam, seyahat, çalışma alanı ve fotoğraf karelerinden seçkiler.",
    usesDescription:
      "Yusuf Dere'nin kullandığı cihazlar, yazılımlar ve çalışma araçları.",
    nowDescription:
      "Yusuf Dere'nin şu anda odaklandığı projeler ve öncelikler.",
    contactDescription: "Yusuf Dere ile iletişime geçin.",
  },
} as const;

type SeoMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
  robots?: Metadata["robots"];
};

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath === "/") {
    return siteUrl;
  }

  return new URL(normalizedPath, siteUrl).toString().replace(/\/$/, "");
}

export function formatMetadataTitle(title?: string) {
  return title || defaultSeo.title;
}

export function formatSocialTitle(title?: string) {
  return title ? `${title} | ${defaultSeo.siteName}` : defaultSeo.title;
}

export function languageAlternates(path = "/") {
  const basePath = stripLocalePrefix(path.startsWith("/") ? path : `/${path}`);

  return {
    en: absoluteUrl(withLocalePrefix(basePath, "en")),
    tr: absoluteUrl(withLocalePrefix(basePath, "tr")),
    "x-default": absoluteUrl(withLocalePrefix(basePath, defaultLocale)),
  };
}

export function localeFromPath(path = "/"): Locale {
  return path === "/tr" || path.startsWith("/tr/") ? "tr" : "en";
}

export function createMetadata({
  title,
  description = defaultSeo.description,
  path = "/",
  locale,
  image = ogImagePath,
  type = "website",
  absoluteTitle = false,
  robots,
}: SeoMetadataInput = {}): Metadata {
  const resolvedLocale = locale || localeFromPath(path);
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const socialTitle = formatSocialTitle(title);
  const resolvedDescription = description || defaultSeo.description;
  const ogLocale = localizedSeo[resolvedLocale].locale;
  const alternateOgLocale = resolvedLocale === "tr" ? "en_US" : "tr_TR";

  return {
    title: title
      ? absoluteTitle
        ? { absolute: formatMetadataTitle(title) }
        : formatMetadataTitle(title)
      : { absolute: defaultSeo.title },
    description: resolvedDescription,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: socialTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: defaultSeo.siteName,
      locale: ogLocale,
      alternateLocale: alternateOgLocale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: defaultSeo.siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: resolvedDescription,
      images: [imageUrl],
    },
    robots,
  };
}
