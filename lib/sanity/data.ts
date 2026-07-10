import {
  aboutPageQuery,
  allGalleryImagesQuery,
  allJournalPostsQuery,
  allNowItemsQuery,
  allProjectsQuery,
  allUsesItemsQuery,
  journalPostBySlugQuery,
  projectBySlugQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { sanityFetch } from "@/lib/sanity/client";
import { urlForImage } from "@/lib/sanity/image";
import type {
  GalleryImage,
  JournalPost,
  NowItem as SanityNowItem,
  AboutPage as SanityAboutPage,
  PortableTextBlock,
  Project,
  SiteSettings,
  UsesItem as SanityUsesItem,
} from "@/lib/sanity/types";
import { type JournalEntry } from "@/content/journal";
import { type FocusItem } from "@/content/now";
import { type GalleryItem } from "@/content/gallery";
import { type UsesCategory, type UsesPageItem } from "@/content/uses";
import { siteConfig } from "@/content/site";
import { aboutPage as aboutFallback } from "@/content/about";
import type { ProjectPreview } from "@/content/home";
import { normalizeIconKey } from "@/lib/icons";
import type { Locale } from "@/lib/locale";

export type ProjectDetail = {
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  category: string;
  techStack: string[];
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  body: string[];
};

export type AboutPageContent = {
  title: string;
  eyebrow: string;
  intro: string;
  body: string[];
  location: string;
  focusAreas: string[];
  currentFocus: string;
  imageUrl?: string;
  updatedAt?: string;
};

export type JournalDetail = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  body: string[];
};

export type GalleryPageItem = GalleryItem & {
  imageUrl?: string;
  description?: string;
};

export type LocalizedUsesPageItem = UsesPageItem & {
  categoryLabel: string;
};

export async function getAboutPage(
  locale: Locale = "en",
): Promise<AboutPageContent> {
  const aboutPage = await fetchOrFallback<SanityAboutPage | null>(
    aboutPageQuery,
    null,
    ["aboutPage"],
  );

  return mapAboutPage(aboutPage, locale);
}

export async function getAllProjects(
  locale: Locale = "en",
): Promise<ProjectPreview[]> {
  const projects = await fetchOrFallback<Project[]>(allProjectsQuery, [], [
    "project",
  ]);
  const mapped = projects.map((project, index) =>
    mapProjectPreview(project, index, locale),
  );

  return mapped;
}

export async function getProjectBySlug(
  slug: string,
  locale: Locale = "en",
): Promise<ProjectDetail | null> {
  const project = await fetchOrFallback<Project | null>(
    projectBySlugQuery,
    null,
    ["project"],
    { slug },
  );

  if (project) {
    return mapProjectDetail(project, locale);
  }

  return null;
}

export async function getAllJournalPosts(
  locale: Locale = "en",
): Promise<JournalEntry[]> {
  const posts = await fetchOrFallback<JournalPost[]>(allJournalPostsQuery, [], [
    "journalPost",
  ]);
  const mapped = posts.map((post) => mapJournalEntry(post, locale));

  return mapped;
}

export async function getJournalPostBySlug(
  slug: string,
  locale: Locale = "en",
): Promise<JournalDetail | null> {
  const post = await fetchOrFallback<JournalPost | null>(
    journalPostBySlugQuery,
    null,
    ["journalPost"],
    { slug },
  );

  if (post) {
    return mapJournalDetail(post, locale);
  }

  return null;
}

export async function getAllGalleryImages(
  locale: Locale = "en",
): Promise<GalleryPageItem[]> {
  const images = await fetchOrFallback<GalleryImage[]>(allGalleryImagesQuery, [], [
    "galleryImage",
  ]);
  const mapped = images.map((image) => mapGalleryItem(image, locale));

  return mapped;
}

export async function getAllUsesItems(
  locale: Locale = "en",
): Promise<LocalizedUsesPageItem[]> {
  const items = await fetchOrFallback<SanityUsesItem[]>(allUsesItemsQuery, [], [
    "usesItem",
  ]);
  const mapped = items.map((item) => mapUsesItem(item, locale));

  return mapped;
}

export async function getAllNowItems(locale: Locale = "en"): Promise<FocusItem[]> {
  const items = await fetchOrFallback<SanityNowItem[]>(allNowItemsQuery, [], [
    "nowItem",
  ]);
  const mapped = items
    .filter((item) => item.active !== false)
    .map((item) => ({
      title: localizedText(locale, {
        en: item.titleEn,
        tr: item.titleTr,
        legacy: item.title,
        fallback: "Current focus",
      }),
      description: localizedText(locale, {
        en: item.descriptionEn,
        tr: item.descriptionTr,
        legacy: item.description,
        fallback: "A current focus item from Sanity.",
      }),
      status: item.active === false ? "Paused" : "Active",
      icon: normalizeIconKey(item.icon),
    }));

  return mapped;
}

export async function getSiteSettings(locale: Locale = "en"): Promise<SiteSettings> {
  const settings = await fetchOrFallback<SiteSettings | null>(
    siteSettingsQuery,
    null,
    ["siteSettings"],
  );

  return {
    name: settings?.name || siteConfig.name,
    bio: localizedText(locale, {
      en: settings?.bioEn,
      tr: settings?.bioTr,
      legacy: settings?.bio,
      fallback: siteConfig.tagline,
    }),
    location: localizedText(locale, {
      en: settings?.locationEn,
      tr: settings?.locationTr,
      legacy: settings?.location,
      fallback: siteConfig.location,
    }),
    email: settings?.email || siteConfig.email,
    instagramUrl: settings?.instagramUrl || siteConfig.instagramUrl,
    githubUrl: settings?.githubUrl || null,
    linkedinUrl: settings?.linkedinUrl || null,
    seoTitle: localizedText(locale, {
      en: settings?.seoTitleEn,
      tr: settings?.seoTitleTr,
      legacy: settings?.seoTitle,
      fallback: siteConfig.name,
    }),
    seoDescription: localizedText(locale, {
      en: settings?.seoDescriptionEn,
      tr: settings?.seoDescriptionTr,
      legacy: settings?.seoDescription,
      fallback: siteConfig.description,
    }),
    ogImage: settings?.ogImage || null,
  };
}

async function fetchOrFallback<T>(
  query: string,
  fallback: T,
  tags: string[],
  params: Record<string, string> = {},
): Promise<T> {
  try {
    return (await sanityFetch({
      query,
      params,
      tags,
    })) as T;
  } catch {
    return fallback;
  }
}

function mapAboutPage(
  page: SanityAboutPage | null,
  locale: Locale,
): AboutPageContent {
  const fallbackBody = aboutFallback.sections.map((section) => section.body);
  const body = localizedPortableText(locale, {
    en: page?.bodyEn,
    tr: page?.bodyTr,
    legacy: page?.body,
  });
  const focusAreas = localizedStringArray(locale, {
    en: page?.focusAreasEn,
    tr: page?.focusAreasTr,
    legacy: page?.focusAreas,
  });

  return {
    title: localizedText(locale, {
      en: page?.titleEn,
      tr: page?.titleTr,
      legacy: page?.title,
      fallback: aboutFallback.title,
    }),
    eyebrow: localizedText(locale, {
      en: page?.eyebrowEn,
      tr: page?.eyebrowTr,
      legacy: page?.eyebrow,
      fallback: aboutFallback.eyebrow,
    }),
    intro: localizedText(locale, {
      en: page?.introEn,
      tr: page?.introTr,
      legacy: page?.intro,
      fallback: aboutFallback.description,
    }),
    body: body.length > 0 ? body : fallbackBody,
    location: page?.location || aboutFallback.stats[0]?.value || siteConfig.location,
    focusAreas:
      focusAreas.length > 0
        ? focusAreas
        : aboutFallback.stats.map((stat) => stat.value),
    currentFocus:
      localizedText(locale, {
        en: page?.currentFocusEn,
        tr: page?.currentFocusTr,
        legacy: page?.currentFocus,
        fallback:
          "Connecting software, product work, journal notes, photography, and the current season of focus.",
      }),
    imageUrl: page?.image ? safeImageUrl(page.image) : undefined,
    updatedAt: page?.updatedAt || undefined,
  };
}

export function localizedText(
  locale: Locale,
  values: {
    en?: string | null;
    tr?: string | null;
    legacy?: string | null;
    fallback: string;
  },
) {
  const preferred =
    locale === "tr"
      ? [values.tr, values.legacy, values.en, values.fallback]
      : [values.en, values.legacy, values.fallback];

  return preferred.map(cleanText).find(Boolean) || values.fallback;
}

export function localizedPortableText(
  locale: Locale,
  values: {
    en?: PortableTextBlock[] | null;
    tr?: PortableTextBlock[] | null;
    legacy?: PortableTextBlock[] | null;
  },
) {
  const preferred =
    locale === "tr"
      ? [values.tr, values.legacy, values.en]
      : [values.en, values.legacy];

  for (const blocks of preferred) {
    const paragraphs = portableTextToParagraphs(blocks);

    if (paragraphs.length > 0) {
      return paragraphs;
    }
  }

  return [];
}

function localizedStringArray(
  locale: Locale,
  values: {
    en?: string[] | null;
    tr?: string[] | null;
    legacy?: string[] | null;
  },
) {
  const preferred =
    locale === "tr"
      ? [values.tr, values.legacy, values.en]
      : [values.en, values.legacy];

  for (const array of preferred) {
    const cleaned = cleanStringArray(array);

    if (cleaned.length > 0) {
      return cleaned;
    }
  }

  return [];
}

function cleanText(value: string | null | undefined) {
  return value?.trim() || "";
}

function cleanStringArray(values: string[] | null | undefined) {
  return values?.map((value) => value.trim()).filter(Boolean) || [];
}

export function mapProjectPreview(
  project: Project,
  index: number,
  locale: Locale = "en",
): ProjectPreview {
  const accents: ProjectPreview["accent"][] = ["violet", "stone", "slate"];

  return {
    title: localizedText(locale, {
      en: project.titleEn,
      tr: project.titleTr,
      legacy: project.title,
      fallback: "Untitled project",
    }),
    description: localizedText(locale, {
      en: project.shortDescriptionEn,
      tr: project.shortDescriptionTr,
      legacy: project.shortDescription,
      fallback: project.category || "A project from the YusufDere.com CMS.",
    }),
    status: toTitleCase(project.status || "Featured"),
    category: localizedText(locale, {
      en: project.categoryLabelEn,
      tr: project.categoryLabelTr,
      legacy: project.category,
      fallback: "Project",
    }),
    techStack: project.techStack || [],
    featured: project.featured === true,
    href: project.slug ? `/projects/${project.slug}` : "/projects",
    accent: accents[index % accents.length],
  };
}

function mapProjectDetail(
  project: Project,
  locale: Locale,
): ProjectDetail {
  const body = localizedPortableText(locale, {
    en: project.descriptionEn,
    tr: project.descriptionTr,
    legacy: project.description,
  });

  return {
    title: localizedText(locale, {
      en: project.titleEn,
      tr: project.titleTr,
      legacy: project.title,
      fallback: "Untitled project",
    }),
    slug: project.slug || "",
    shortDescription: localizedText(locale, {
      en: project.shortDescriptionEn,
      tr: project.shortDescriptionTr,
      legacy: project.shortDescription,
      fallback: "A project from the YusufDere.com CMS.",
    }),
    status: toTitleCase(project.status || "Featured"),
    category: localizedText(locale, {
      en: project.categoryLabelEn,
      tr: project.categoryLabelTr,
      legacy: project.category,
      fallback: "Project",
    }),
    techStack: project.techStack || [],
    featured: project.featured === true,
    liveUrl: project.liveUrl || undefined,
    githubUrl: project.githubUrl || undefined,
    body,
  };
}

export function mapJournalEntry(
  post: JournalPost,
  locale: Locale = "en",
): JournalEntry {
  return {
    title: localizedText(locale, {
      en: post.titleEn,
      tr: post.titleTr,
      legacy: post.title,
      fallback: "Untitled note",
    }),
    excerpt: localizedText(locale, {
      en: post.excerptEn,
      tr: post.excerptTr,
      legacy: post.excerpt,
      fallback: "A short note from the journal.",
    }),
    category: normalizeJournalCategory(post.category),
    date: formatDate(post.date),
    href: post.slug ? `/journal/${post.slug}` : "/journal",
  };
}

function mapJournalDetail(
  post: JournalPost,
  locale: Locale,
): JournalDetail {
  const body = localizedPortableText(locale, {
    en: post.contentEn,
    tr: post.contentTr,
    legacy: post.content,
  });
  const excerpt = localizedText(locale, {
    en: post.excerptEn,
    tr: post.excerptTr,
    legacy: post.excerpt,
    fallback: "A short note from the journal.",
  });

  return {
    title: localizedText(locale, {
      en: post.titleEn,
      tr: post.titleTr,
      legacy: post.title,
      fallback: "Untitled note",
    }),
    slug: post.slug || "",
    excerpt,
    category: post.category || "Thought",
    date: formatDate(post.date),
    body:
      body.length > 0 ? body : [excerpt || "More details will be added soon."],
  };
}

export function mapGalleryItem(
  image: GalleryImage,
  locale: Locale = "en",
): GalleryPageItem {
  return {
    title: localizedText(locale, {
      en: image.titleEn,
      tr: image.titleTr,
      legacy: image.title,
      fallback: "Gallery image",
    }),
    category: normalizeGalleryCategory(image.category),
    location: localizedText(locale, {
      en: image.locationEn,
      tr: image.locationTr,
      legacy: image.location,
      fallback: image.category || "Gallery",
    }),
    description: localizedText(locale, {
      en: image.descriptionEn,
      tr: image.descriptionTr,
      legacy: image.description,
      fallback: "",
    }) || undefined,
    imageUrl: image.image ? safeImageUrl(image.image) : undefined,
  };
}

export function mapUsesItem(
  item: SanityUsesItem,
  locale: Locale = "en",
): LocalizedUsesPageItem {
  const category = normalizeUsesCategory(item.category);

  return {
    title: localizedText(locale, {
      en: item.titleEn,
      tr: item.titleTr,
      legacy: item.title,
      fallback: "Tool",
    }),
    category,
    categoryLabel: localizedText(locale, {
      en: item.categoryLabelEn,
      tr: item.categoryLabelTr,
      legacy: item.category,
      fallback: category,
    }),
    description: localizedText(locale, {
      en: item.descriptionEn,
      tr: item.descriptionTr,
      legacy: item.description,
      fallback: "A tool from the YusufDere.com setup.",
    }),
    icon: normalizeIconKey(item.icon),
  };
}

function portableTextToParagraphs(blocks: PortableTextBlock[] | null | undefined) {
  const paragraphs =
    blocks
      ?.map((block) =>
        block.children
          ?.map((child) => child.text)
          .filter(Boolean)
          .join(" ")
          .trim(),
      )
      .filter((text): text is string => Boolean(text)) || [];

  return paragraphs.length > 0 ? paragraphs : [];
}

function safeImageUrl(image: GalleryImage["image"]) {
  if (!image) {
    return undefined;
  }

  try {
    return urlForImage(image).width(900).height(1125).url();
  } catch {
    return undefined;
  }
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string | null | undefined) {
  if (!date) {
    return "Undated";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Undated";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function normalizeJournalCategory(
  category: string | null | undefined,
): JournalEntry["category"] {
  if (
    category === "Thought" ||
    category === "Development Log" ||
    category === "Behind the Scenes" ||
    category === "Life Note"
  ) {
    return category;
  }

  return "Thought";
}

function normalizeGalleryCategory(
  category: string | null | undefined,
): GalleryItem["category"] {
  if (
    category === "Lifestyle" ||
    category === "Travel" ||
    category === "Cars" ||
    category === "Motorcycles" ||
    category === "Coffee" ||
    category === "Workspace" ||
    category === "Photography"
  ) {
    return category;
  }

  return "Photography";
}

function normalizeUsesCategory(
  category: string | null | undefined,
): UsesCategory {
  if (
    category === "Hardware" ||
    category === "Software" ||
    category === "Desk" ||
    category === "Apps" ||
    category === "Everyday Carry"
  ) {
    return category;
  }

  return "Apps";
}
