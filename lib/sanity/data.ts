import {
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
  PortableTextBlock,
  Project,
  SiteSettings,
  UsesItem as SanityUsesItem,
} from "@/lib/sanity/types";
import { journalEntries, type JournalEntry } from "@/content/journal";
import { focusItems, type FocusItem } from "@/content/now";
import { projectItems } from "@/content/projects";
import { galleryItems, type GalleryItem } from "@/content/gallery";
import { usesItems, type UsesCategory, type UsesPageItem } from "@/content/uses";
import { siteConfig } from "@/content/site";
import type { ProjectPreview } from "@/content/home";

export type ProjectDetail = {
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  body: string[];
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

export async function getAllProjects(): Promise<ProjectPreview[]> {
  const projects = await fetchOrFallback<Project[]>(allProjectsQuery, [], [
    "project",
  ]);
  const mapped = projects
    .filter((project) => Boolean(project.title))
    .map((project, index) => mapProjectPreview(project, index));

  return mapped.length > 0 ? mapped : projectItems;
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDetail | null> {
  const project = await fetchOrFallback<Project | null>(
    projectBySlugQuery,
    null,
    ["project"],
    { slug },
  );

  if (project?.title) {
    return mapProjectDetail(project);
  }

  const fallback = projectItems.find((item) => slugFromHref(item.href) === slug);

  if (!fallback) {
    return null;
  }

  return {
    title: fallback.title,
    slug,
    shortDescription: fallback.description,
    status: fallback.status,
    category: fallback.status === "Open Source" ? "Open Source" : "Product",
    techStack: fallback.title === "GitHub" ? ["Code", "Experiments"] : ["Next.js", "TypeScript", "Sanity"],
    liveUrl: undefined,
    githubUrl: fallback.title === "GitHub" ? "https://github.com/heyyud3" : undefined,
    body: [
      fallback.description,
      "This placeholder detail page is ready to be replaced by Sanity content once the project entry is published.",
    ],
  };
}

export async function getAllJournalPosts(): Promise<JournalEntry[]> {
  const posts = await fetchOrFallback<JournalPost[]>(allJournalPostsQuery, [], [
    "journalPost",
  ]);
  const mapped = posts
    .filter((post) => Boolean(post.title))
    .map(mapJournalEntry);

  return mapped.length > 0 ? mapped : journalEntries;
}

export async function getJournalPostBySlug(
  slug: string,
): Promise<JournalDetail | null> {
  const post = await fetchOrFallback<JournalPost | null>(
    journalPostBySlugQuery,
    null,
    ["journalPost"],
    { slug },
  );

  if (post?.title) {
    return mapJournalDetail(post);
  }

  const fallback = journalEntries.find((entry) => slugFromHref(entry.href) === slug);

  if (!fallback) {
    return null;
  }

  return {
    title: fallback.title,
    slug,
    excerpt: fallback.excerpt,
    category: fallback.category,
    date: fallback.date,
    body: [
      fallback.excerpt,
      "This placeholder note keeps the route available until the full journal entry is written in Sanity.",
    ],
  };
}

export async function getAllGalleryImages(): Promise<GalleryPageItem[]> {
  const images = await fetchOrFallback<GalleryImage[]>(allGalleryImagesQuery, [], [
    "galleryImage",
  ]);
  const mapped = images
    .filter((image) => Boolean(image.title))
    .map(mapGalleryItem);

  return mapped.length > 0 ? mapped : galleryItems;
}

export async function getAllUsesItems(): Promise<UsesPageItem[]> {
  const items = await fetchOrFallback<SanityUsesItem[]>(allUsesItemsQuery, [], [
    "usesItem",
  ]);
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item) => ({
      title: item.title || "Tool",
      category: normalizeUsesCategory(item.category),
      description: item.description || "A tool from the YusufDere.com setup.",
    }));

  return mapped.length > 0 ? mapped : usesItems;
}

export async function getAllNowItems(): Promise<FocusItem[]> {
  const items = await fetchOrFallback<SanityNowItem[]>(allNowItemsQuery, [], [
    "nowItem",
  ]);
  const mapped = items
    .filter((item) => Boolean(item.title))
    .map((item) => ({
      title: item.title || "Current focus",
      description: item.description || "A current focus item from Sanity.",
      status: item.active === false ? "Paused" : "Active",
    }));

  return mapped.length > 0 ? mapped : focusItems;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const settings = await fetchOrFallback<SiteSettings | null>(
    siteSettingsQuery,
    null,
    ["siteSettings"],
  );

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
      revalidate: 60,
    })) as T;
  } catch {
    return fallback;
  }
}

function mapProjectPreview(project: Project, index: number): ProjectPreview {
  const accents: ProjectPreview["accent"][] = ["violet", "stone", "slate"];

  return {
    title: project.title || "Untitled project",
    description:
      project.shortDescription ||
      project.category ||
      "A project from the YusufDere.com CMS.",
    status: toTitleCase(project.status || "Featured"),
    href: project.slug ? `/projects/${project.slug}` : "/projects",
    accent: accents[index % accents.length],
  };
}

function mapProjectDetail(project: Project): ProjectDetail {
  return {
    title: project.title || "Untitled project",
    slug: project.slug || "",
    shortDescription:
      project.shortDescription || "A project from the YusufDere.com CMS.",
    status: toTitleCase(project.status || "Featured"),
    category: project.category || "Project",
    techStack: project.techStack || [],
    liveUrl: project.liveUrl || undefined,
    githubUrl: project.githubUrl || undefined,
    body: portableTextToParagraphs(project.description).concat(
      project.shortDescription ? [] : ["More details will be added soon."],
    ),
  };
}

function mapJournalEntry(post: JournalPost): JournalEntry {
  return {
    title: post.title || "Untitled note",
    excerpt: post.excerpt || "A short note from the journal.",
    category: normalizeJournalCategory(post.category),
    date: formatDate(post.date),
    href: post.slug ? `/journal/${post.slug}` : "/journal",
  };
}

function mapJournalDetail(post: JournalPost): JournalDetail {
  return {
    title: post.title || "Untitled note",
    slug: post.slug || "",
    excerpt: post.excerpt || "A short note from the journal.",
    category: post.category || "Thought",
    date: formatDate(post.date),
    body: portableTextToParagraphs(post.content).concat(
      post.excerpt ? [] : ["More details will be added soon."],
    ),
  };
}

function mapGalleryItem(image: GalleryImage): GalleryPageItem {
  return {
    title: image.title || "Gallery image",
    category: normalizeGalleryCategory(image.category),
    location: image.location || image.category || "Gallery",
    description: image.description || undefined,
    imageUrl: image.image ? safeImageUrl(image.image) : undefined,
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

function slugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1);
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
    category === "Apps" ||
    category === "Everyday Carry"
  ) {
    return category;
  }

  return "Apps";
}
