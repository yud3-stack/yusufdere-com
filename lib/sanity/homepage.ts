import {
  featuredGalleryImagesQuery,
  featuredJournalPostsQuery,
  featuredProjectsQuery,
  featuredUsesItemsQuery,
  activeNowItemsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { sanityFetch } from "@/lib/sanity/client";
import type {
  GalleryImage,
  JournalPost,
  NowItem as SanityNowItem,
  Project,
  SiteSettings,
  UsesItem as SanityUsesItem,
} from "@/lib/sanity/types";
import {
  featuredProjects,
  galleryPreviews,
  journalPreviews,
  nowItems,
  usesItems,
  type GalleryPreview,
  type JournalPreview,
  type NowItem,
  type ProjectPreview,
  type UsesItem,
} from "@/content/home";
import { siteConfig } from "@/content/site";

type HomePageData = {
  siteSettings: SiteSettings;
  projects: ProjectPreview[];
  journalPosts: JournalPreview[];
  nowItems: NowItem[];
  usesItems: UsesItem[];
  galleryItems: GalleryPreview[];
};

const projectAccents: ProjectPreview["accent"][] = ["violet", "stone", "slate"];
const nowIconFallbacks: NowItem["icon"][] = ["code", "spark", "book"];
const usesIconFallbacks: UsesItem["icon"][] = [
  "laptop",
  "phone",
  "camera",
  "headphones",
  "code",
  "app",
];

export async function getHomepageData(): Promise<HomePageData> {
  const [
    siteSettings,
    projects,
    journalPosts,
    activeNowItems,
    featuredUsesItems,
    featuredGalleryImages,
  ] = await Promise.all([
    fetchOrFallback<SiteSettings | null>(siteSettingsQuery, null, [
      "siteSettings",
    ]),
    fetchOrFallback<Project[]>(featuredProjectsQuery, [], ["project"]),
    fetchOrFallback<JournalPost[]>(featuredJournalPostsQuery, [], [
      "journalPost",
    ]),
    fetchOrFallback<SanityNowItem[]>(activeNowItemsQuery, [], ["nowItem"]),
    fetchOrFallback<SanityUsesItem[]>(featuredUsesItemsQuery, [], ["usesItem"]),
    fetchOrFallback<GalleryImage[]>(featuredGalleryImagesQuery, [], [
      "galleryImage",
    ]),
  ]);

  return {
    siteSettings: withSiteSettingsFallback(siteSettings),
    projects: mapProjects(projects),
    journalPosts: mapJournalPosts(journalPosts),
    nowItems: mapNowItems(activeNowItems),
    usesItems: mapUsesItems(featuredUsesItems),
    galleryItems: mapGalleryImages(featuredGalleryImages),
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
      revalidate: 60,
    })) as T;
  } catch {
    return fallback;
  }
}

function withSiteSettingsFallback(settings: SiteSettings | null): SiteSettings {
  return {
    name: settings?.name || siteConfig.name,
    bio: settings?.bio || siteConfig.tagline,
    location: settings?.location || siteConfig.location,
    email: settings?.email || siteConfig.email,
    instagramUrl: settings?.instagramUrl || siteConfig.instagramUrl,
    githubUrl: settings?.githubUrl || null,
    linkedinUrl: settings?.linkedinUrl || null,
    seoTitle: settings?.seoTitle || siteConfig.name,
    seoDescription: settings?.seoDescription || siteConfig.description,
    ogImage: settings?.ogImage || null,
  };
}

function mapProjects(projects: Project[]): ProjectPreview[] {
  const mapped = projects
    .filter((project) => Boolean(project.title))
    .map((project, index) => ({
      title: project.title || "Untitled project",
      description:
        project.shortDescription ||
        project.category ||
        "A project from the YusufDere.com CMS.",
      status: toTitleCase(project.status || "Featured"),
      href: project.slug ? `/projects/${project.slug}` : project.liveUrl || "/projects",
      accent: projectAccents[index % projectAccents.length],
    }));

  return mapped.length > 0 ? mapped : featuredProjects;
}

function mapJournalPosts(posts: JournalPost[]): JournalPreview[] {
  const mapped = posts
    .filter((post) => Boolean(post.title))
    .map((post) => ({
      title: post.title || "Untitled note",
      excerpt: post.excerpt || post.category || "A short note from the journal.",
      date: formatDate(post.date),
      href: post.slug ? `/journal/${post.slug}` : "/journal",
    }));

  return mapped.length > 0 ? mapped : journalPreviews;
}

function mapNowItems(items: SanityNowItem[]): NowItem[] {
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item, index) => ({
      title: item.title || "Current focus",
      description: item.description || "A current focus item from the CMS.",
      icon: normalizeNowIcon(item.icon, index),
    }));

  return mapped.length > 0 ? mapped : nowItems;
}

function mapUsesItems(items: SanityUsesItem[]): UsesItem[] {
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item, index) => ({
      title: item.title || "Tool",
      category: item.category || "Setup",
      icon: normalizeUsesIcon(item.icon, index),
    }));

  return mapped.length > 0 ? mapped : usesItems;
}

function mapGalleryImages(images: GalleryImage[]): GalleryPreview[] {
  const mapped = images
    .filter((image) => Boolean(image.title))
    .map((image) => ({
      title: image.title || "Gallery image",
      location: image.location || image.category || "Gallery",
    }));

  return mapped.length > 0 ? mapped : galleryPreviews;
}

function normalizeNowIcon(icon: string | null | undefined, index: number) {
  if (icon === "code" || icon === "spark" || icon === "book") {
    return icon;
  }

  return nowIconFallbacks[index % nowIconFallbacks.length];
}

function normalizeUsesIcon(icon: string | null | undefined, index: number) {
  if (
    icon === "laptop" ||
    icon === "phone" ||
    icon === "camera" ||
    icon === "headphones" ||
    icon === "code" ||
    icon === "app"
  ) {
    return icon;
  }

  return usesIconFallbacks[index % usesIconFallbacks.length];
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
