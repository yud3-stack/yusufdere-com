import type { ProjectPreview } from "@/content/home";
import type { Locale } from "@/lib/locale";

export const studioUrl = "https://studio.yusufdere.com";

export const studioContent = {
  en: {
    title: "Yusuf Dere Studio",
    description:
      "Photography, content, social media and web presence for modern brands.",
    action: "Visit Studio",
    category: "Studio",
    status: "Service",
  },
  tr: {
    title: "Yusuf Dere Studio",
    description:
      "Modern markalar için fotoğraf, içerik, sosyal medya ve web görünürlüğü.",
    action: "Studio’yu ziyaret et",
    category: "Studio",
    status: "Servis",
  },
} as const;

export function getStudioContent(locale: Locale = "en") {
  return studioContent[locale];
}

export function getStudioProject(locale: Locale = "en"): ProjectPreview {
  const content = getStudioContent(locale);

  return {
    title: content.title,
    description: content.description,
    status: content.status,
    category: content.category,
    techStack:
      locale === "tr"
        ? ["Fotoğraf", "İçerik", "Web"]
        : ["Photography", "Content", "Web"],
    featured: false,
    href: studioUrl,
    external: true,
    actionLabel: content.action,
    accent: "stone",
  };
}
