import type { Metadata } from "next";

import { stripLocalePrefix, withLocalePrefix } from "@/lib/locale";

export const siteUrl = "https://yusufdere.com";
export const ogImagePath = "/images/og/yusufdere-og.png";

export const defaultSeo = {
  siteName: "Yusuf Dere",
  title: "Yusuf Dere",
  description: "Software, products, notes and photography from Samsun.",
  locale: "en_US",
} as const;

type SeoMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  absoluteTitle?: boolean;
  robots?: Metadata["robots"];
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
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
  };
}

export function createMetadata({
  title,
  description = defaultSeo.description,
  path = "/",
  image = ogImagePath,
  type = "website",
  absoluteTitle = false,
  robots,
}: SeoMetadataInput = {}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  const socialTitle = formatSocialTitle(title);

  return {
    title: title
      ? absoluteTitle
        ? { absolute: formatMetadataTitle(title) }
        : formatMetadataTitle(title)
      : { absolute: defaultSeo.title },
    description,
    alternates: {
      canonical,
      languages: languageAlternates(path),
    },
    openGraph: {
      title: socialTitle,
      description,
      url: canonical,
      siteName: defaultSeo.siteName,
      locale: defaultSeo.locale,
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
      description,
      images: [imageUrl],
    },
    robots,
  };
}
