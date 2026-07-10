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

const aboutFallbackByLocale = {
  en: aboutFallback,
  tr: {
    eyebrow: "Hakkında",
    title: "İnşa etmek, düşünmek ve dönüşmek için daha sakin bir alan.",
    description:
      "Yusuf Dere; yazılım, ürünler, fotoğraf ve niyetli bir hayat inşa etme disiplini etrafında kişisel bir merkez kuruyor.",
    sections: [
      {
        title: "Yazılımı ivme kurmanın bir yolu olarak görmek",
        body: "İş, faydalı ürünlerle başlıyor: küçük sistemler, AI araçları, web deneyimleri ve fikirleri dokunulabilir hale getiren denemeler.",
      },
      {
        title: "Samsun'u görsel bir dayanak olarak taşımak",
        body: "Samsun markaya kıyı ritmi veriyor: şehir ışıkları, uzun akşamlar, hareket ve sakin bir hırs.",
      },
      {
        title: "Performansa dönüşmeyen kişisel marka",
        body: "YusufDere.com merkezde duruyor; projeleri, notları, güncel odağı, araçları ve gelecek deneyleri aynı yerde topluyor.",
      },
    ],
    stats: [
      { label: "Merkez", value: "Samsun" },
      { label: "Odak", value: "Ürünler" },
      { label: "Mod", value: "İnşa" },
    ],
  },
} as const;

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
        fallback: localizedFallback(locale, "Current focus", "Güncel odak"),
      }),
      description: localizedText(locale, {
        en: item.descriptionEn,
        tr: item.descriptionTr,
        legacy: item.description,
        fallback: localizedFallback(
          locale,
          "A current focus item from Sanity.",
          "Sanity üzerinden gelen güncel bir odak.",
        ),
      }),
      status: localizeNowStatus(item.active, locale),
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
      fallback: localizedFallback(
        locale,
        siteConfig.tagline,
        "Hayal ettiğim hayatı inşa ediyorum.",
      ),
    }),
    location: localizedText(locale, {
      en: settings?.locationEn,
      tr: settings?.locationTr,
      legacy: settings?.location,
      fallback: localizedFallback(locale, siteConfig.location, "Samsun, Türkiye"),
    }),
    email: siteConfig.email,
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
      fallback: localizedFallback(
        locale,
        siteConfig.description,
        "Samsun'dan yazılım, ürünler, notlar ve fotoğraf.",
      ),
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
  const staticFallback = aboutFallbackByLocale[locale];
  const fallbackBody = staticFallback.sections.map((section) => section.body);
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
      fallback: staticFallback.title,
    }),
    eyebrow: localizedText(locale, {
      en: page?.eyebrowEn,
      tr: page?.eyebrowTr,
      legacy: page?.eyebrow,
      fallback: staticFallback.eyebrow,
    }),
    intro: localizedText(locale, {
      en: page?.introEn,
      tr: page?.introTr,
      legacy: page?.intro,
      fallback: staticFallback.description,
    }),
    body: body.length > 0 ? body : fallbackBody,
    location:
      page?.location ||
      staticFallback.stats[0]?.value ||
      localizedFallback(locale, siteConfig.location, "Samsun, Türkiye"),
    focusAreas:
      focusAreas.length > 0
        ? focusAreas
        : staticFallback.stats.map((stat) => stat.value),
    currentFocus:
      localizedText(locale, {
        en: page?.currentFocusEn,
        tr: page?.currentFocusTr,
        legacy: page?.currentFocus,
        fallback: localizedFallback(
          locale,
          "Connecting software, product work, journal notes, photography, and the current season of focus.",
          "Yazılımı, ürün çalışmalarını, notları, fotoğrafı ve güncel odağı aynı sakin merkezde birleştirmek.",
        ),
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
      ? [values.tr, values.en, values.legacy, values.fallback]
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
      ? [values.tr, values.en, values.legacy]
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
      ? [values.tr, values.en, values.legacy]
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
      fallback: localizedFallback(locale, "Untitled project", "Başlıksız proje"),
    }),
    description: localizedText(locale, {
      en: project.shortDescriptionEn,
      tr: project.shortDescriptionTr,
      legacy: project.shortDescription,
      fallback: localizedFallback(
        locale,
        project.category || "A project from the YusufDere.com CMS.",
        "YusufDere.com CMS içinden bir proje.",
      ),
    }),
    status: localizeProjectStatus(project.status, locale),
    category: localizedText(locale, {
      en: project.categoryLabelEn,
      tr: project.categoryLabelTr,
      legacy: null,
      fallback: localizeProjectCategory(project.category, locale),
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
      fallback: localizedFallback(locale, "Untitled project", "Başlıksız proje"),
    }),
    slug: project.slug || "",
    shortDescription: localizedText(locale, {
      en: project.shortDescriptionEn,
      tr: project.shortDescriptionTr,
      legacy: project.shortDescription,
      fallback: localizedFallback(
        locale,
        "A project from the YusufDere.com CMS.",
        "YusufDere.com CMS içinden bir proje.",
      ),
    }),
    status: localizeProjectStatus(project.status, locale),
    category: localizedText(locale, {
      en: project.categoryLabelEn,
      tr: project.categoryLabelTr,
      legacy: null,
      fallback: localizeProjectCategory(project.category, locale),
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
      fallback: localizedFallback(locale, "Untitled note", "Başlıksız not"),
    }),
    excerpt: localizedText(locale, {
      en: post.excerptEn,
      tr: post.excerptTr,
      legacy: post.excerpt,
      fallback: localizedFallback(
        locale,
        "A short note from the journal.",
        "Notlardan kısa bir kayıt.",
      ),
    }),
    category: localizeJournalCategory(post.category, locale),
    date: formatDate(post.date, locale),
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
    fallback: localizedFallback(
      locale,
      "A short note from the journal.",
      "Notlardan kısa bir kayıt.",
    ),
  });

  return {
    title: localizedText(locale, {
      en: post.titleEn,
      tr: post.titleTr,
      legacy: post.title,
      fallback: localizedFallback(locale, "Untitled note", "Başlıksız not"),
    }),
    slug: post.slug || "",
    excerpt,
    category: localizeJournalCategory(post.category, locale),
    date: formatDate(post.date, locale),
    body:
      body.length > 0
        ? body
        : [
            excerpt ||
              localizedFallback(
                locale,
                "More details will be added soon.",
                "Daha fazla detay yakında eklenecek.",
              ),
          ],
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
      fallback: localizedFallback(locale, "Gallery image", "Galeri görseli"),
    }),
    category: localizeGalleryCategory(image.category, locale),
    location: localizedText(locale, {
      en: image.locationEn,
      tr: image.locationTr,
      legacy: image.location,
      fallback: localizeGalleryCategory(image.category, locale),
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
      fallback: localizedFallback(locale, "Tool", "Araç"),
    }),
    category,
    categoryLabel: localizedText(locale, {
      en: item.categoryLabelEn,
      tr: item.categoryLabelTr,
      legacy: null,
      fallback: localizeUsesCategoryLabel(category, locale),
    }),
    description: localizedText(locale, {
      en: item.descriptionEn,
      tr: item.descriptionTr,
      legacy: item.description,
      fallback: localizedFallback(
        locale,
        "A tool from the YusufDere.com setup.",
        "YusufDere.com kurulumundan bir araç.",
      ),
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

function localizedFallback(locale: Locale, en: string, tr: string) {
  return locale === "tr" ? tr : en;
}

function toTitleCase(value: string) {
  return value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(date: string | null | undefined, locale: Locale) {
  if (!date) {
    return localizedFallback(locale, "Undated", "Tarihsiz");
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return localizedFallback(locale, "Undated", "Tarihsiz");
  }

  return new Intl.DateTimeFormat(locale === "tr" ? "tr-TR" : "en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function normalizeLookupKey(value: string | null | undefined) {
  return value?.trim().toLowerCase().replace(/[\s_-]+/g, "-") || "";
}

function localizeProjectStatus(status: string | null | undefined, locale: Locale) {
  const key = normalizeLookupKey(status || "featured");

  const trLabels: Record<string, string> = {
    idea: "Fikir",
    building: "İnşa ediliyor",
    live: "Yayında",
    paused: "Duraklatıldı",
    archived: "Arşivlendi",
    featured: "Öne çıkan",
  };

  if (locale === "tr") {
    return trLabels[key] || trLabels.featured;
  }

  return toTitleCase(status || "Featured");
}

function localizeNowStatus(active: boolean | null | undefined, locale: Locale) {
  if (active === false) {
    return localizedFallback(locale, "Paused", "Duraklatıldı");
  }

  return localizedFallback(locale, "Active", "Aktif");
}

function localizeProjectCategory(
  category: string | null | undefined,
  locale: Locale,
) {
  const value = category || "Project";
  const trLabels: Record<string, string> = {
    AI: "AI",
    SaaS: "SaaS",
    Web: "Web",
    Mobile: "Mobil",
    Experiment: "Deney",
    "Open Source": "Açık kaynak",
    Project: "Proje",
  };

  return locale === "tr" ? trLabels[value] || value : value;
}

function localizeJournalCategory(
  category: string | null | undefined,
  locale: Locale,
) {
  const value = category || "Thought";
  const trLabels: Record<string, string> = {
    Thought: "Düşünce",
    "Development Log": "Geliştirme günlüğü",
    "Behind the Scenes": "Perde arkası",
    "Life Note": "Hayat notu",
  };

  return locale === "tr" ? trLabels[value] || value : value;
}

function localizeGalleryCategory(
  category: string | null | undefined,
  locale: Locale,
) {
  const value = category || "Photography";
  const trLabels: Record<string, string> = {
    Lifestyle: "Yaşam",
    Travel: "Seyahat",
    Cars: "Arabalar",
    Motorcycles: "Motosikletler",
    Coffee: "Kahve",
    Workspace: "Çalışma alanı",
    Photography: "Fotoğraf",
    Gallery: "Galeri",
  };

  return locale === "tr" ? trLabels[value] || value : value;
}

function localizeUsesCategoryLabel(category: UsesCategory, locale: Locale) {
  if (locale !== "tr") {
    return category;
  }

  const labels: Record<UsesCategory, string> = {
    Hardware: "Donanım",
    Software: "Yazılım",
    Desk: "Masa",
    Apps: "Uygulamalar",
    "Everyday Carry": "Günlük taşıma",
  };

  return labels[category];
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
