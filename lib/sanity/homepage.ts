import {
  featuredGalleryImagesQuery,
  featuredJournalPostsQuery,
  featuredProjectsQuery,
  featuredUsesItemsQuery,
  activeNowItemsQuery,
  siteSettingsQuery,
} from "@/lib/sanity/queries";
import { sanityFetch } from "@/lib/sanity/client";
import { getAboutPage, type AboutPageContent } from "@/lib/sanity/data";
import type {
  GalleryImage,
  JournalPost,
  NowItem as SanityNowItem,
  Project,
  SiteSettings,
  UsesItem as SanityUsesItem,
} from "@/lib/sanity/types";
import {
  type GalleryPreview,
  type JournalPreview,
  type NowItem,
  type ProjectPreview,
  type UsesItem,
} from "@/content/home";
import { siteConfig } from "@/content/site";
import { normalizeIconKey } from "@/lib/icons";

type HomePageData = {
  siteSettings: SiteSettings;
  aboutPage: AboutPageContent;
  projects: ProjectPreview[];
  journalPosts: JournalPreview[];
  nowItems: NowItem[];
  usesItems: UsesItem[];
  galleryItems: GalleryPreview[];
};

const projectAccents: ProjectPreview["accent"][] = ["violet", "stone", "slate"];

export async function getHomepageData(): Promise<HomePageData> {
  const [
    siteSettings,
    aboutPage,
    projects,
    journalPosts,
    activeNowItems,
    featuredUsesItems,
    featuredGalleryImages,
  ] = await Promise.all([
    fetchOrFallback<SiteSettings | null>(siteSettingsQuery, null, [
      "siteSettings",
    ]),
    getAboutPage(),
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
    aboutPage,
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
      category: project.category || "Project",
      techStack: project.techStack || [],
      featured: project.featured === true,
      href: project.slug ? `/projects/${project.slug}` : project.liveUrl || "/projects",
      accent: projectAccents[index % projectAccents.length],
    }));

  return mapped;
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

  return mapped;
}

function mapNowItems(items: SanityNowItem[]): NowItem[] {
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item) => ({
      title: item.title || "Current focus",
      description: item.description || "A current focus item from the CMS.",
      icon: normalizeIconKey(item.icon),
    }));

  return mapped;
}

function mapUsesItems(items: SanityUsesItem[]): UsesItem[] {
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item) => ({
      title: item.title || "Tool",
      category: item.category || "Setup",
      icon: normalizeIconKey(item.icon),
    }));

  return mapped;
}

function mapGalleryImages(images: GalleryImage[]): GalleryPreview[] {
  const mapped = images
    .filter((image) => Boolean(image.title))
    .map((image) => ({
      title: image.title || "Gallery image",
      location: image.location || image.category || "Gallery",
    }));

  return mapped;
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
