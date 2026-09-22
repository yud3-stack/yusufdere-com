import {
  featuredGalleryImagesQuery,
  featuredJournalPostsQuery,
  featuredProjectsQuery,
  activeNowItemsQuery,
} from "@/lib/sanity/queries";
import { sanityFetch } from "@/lib/sanity/client";
import {
  getAboutPage,
  getSiteSettings,
  localizedText,
  mapGalleryItem,
  mapJournalEntry,
  mapProjectPreview,
  type AboutPageContent,
} from "@/lib/sanity/data";
import type {
  GalleryImage,
  JournalPost,
  NowItem as SanityNowItem,
  Project,
  SiteSettings,
} from "@/lib/sanity/types";
import {
  type GalleryPreview,
  type JournalPreview,
  type NowItem,
  type ProjectPreview,
} from "@/content/home";
import { normalizeIconKey } from "@/lib/icons";
import type { Locale } from "@/lib/locale";

type HomePageData = {
  siteSettings: SiteSettings;
  aboutPage: AboutPageContent;
  projects: ProjectPreview[];
  journalPosts: JournalPreview[];
  nowItems: NowItem[];
  galleryItems: GalleryPreview[];
};

export async function getHomepageData(locale: Locale = "en"): Promise<HomePageData> {
  const [
    siteSettings,
    aboutPage,
    projects,
    journalPosts,
    activeNowItems,
    featuredGalleryImages,
  ] = await Promise.all([
    getSiteSettings(locale),
    getAboutPage(locale),
    fetchOrFallback<Project[]>(featuredProjectsQuery, [], ["project"]),
    fetchOrFallback<JournalPost[]>(featuredJournalPostsQuery, [], [
      "journalPost",
    ]),
    fetchOrFallback<SanityNowItem[]>(activeNowItemsQuery, [], ["nowItem"]),
    fetchOrFallback<GalleryImage[]>(featuredGalleryImagesQuery, [], [
      "galleryImage",
    ]),
  ]);

  return {
    siteSettings,
    aboutPage,
    projects: mapProjects(projects, locale),
    journalPosts: mapJournalPosts(journalPosts, locale),
    nowItems: mapNowItems(activeNowItems, locale),
    galleryItems: mapGalleryImages(featuredGalleryImages, locale),
  };
}

async function fetchOrFallback<T>(
  query: string,
  fallback: T,
  tags: string[],
): Promise<T> {
  try {
    return (await sanityFetch({
      query,
      tags,
    })) as T;
  } catch {
    return fallback;
  }
}

function mapProjects(projects: Project[], locale: Locale): ProjectPreview[] {
  const mapped = projects.map((project, index) =>
    mapProjectPreview(project, index, locale),
  );

  return mapped;
}

function mapJournalPosts(
  posts: JournalPost[],
  locale: Locale,
): JournalPreview[] {
  const mapped = posts.map((post) => mapJournalEntry(post, locale));

  return mapped;
}

function mapNowItems(items: SanityNowItem[], locale: Locale): NowItem[] {
  const mapped = items
    .filter((item) => item.active !== false)
    .map((item) => ({
      title: localizedText(locale, {
        en: item.titleEn,
        tr: item.titleTr,
        legacy: item.title,
        fallback: locale === "tr" ? "Güncel odak" : "Current focus",
      }),
      description: localizedText(locale, {
        en: item.descriptionEn,
        tr: item.descriptionTr,
        legacy: item.description,
        fallback:
          locale === "tr"
            ? "CMS üzerinden gelen güncel bir odak."
            : "A current focus item from the CMS.",
      }),
      icon: normalizeIconKey(item.icon),
    }));

  return mapped;
}

function mapGalleryImages(
  images: GalleryImage[],
  locale: Locale,
): GalleryPreview[] {
  const mapped = images.map((image) => {
    const mappedImage = mapGalleryItem(image, locale);

    return {
      title: mappedImage.title,
      location: mappedImage.location,
    };
  });

  return mapped;
}
