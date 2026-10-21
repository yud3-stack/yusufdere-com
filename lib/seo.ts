import type { MetadataRoute } from "next";

type SlugEntry = { slug: string };
type ContentEntry = {
  title: string;
  slug: string;
  published_at: string | null;
};
type Breadcrumb = { name: string; path: string };

export function buildSitemap(siteUrl: string, posts: SlugEntry[], projects: SlugEntry[]): MetadataRoute.Sitemap {
  const paths = [
    "/", "/blog", "/projects", "/about", "/privacy",
    ...posts.map(post => `/blog/${encodeURIComponent(post.slug)}`),
    ...projects.map(project => `/projects/${encodeURIComponent(project.slug)}`),
  ];
  // Collection queries don't expose modification dates. Do not invent lastmod values.
  return [...new Set(paths)].map(path => ({ url: `${siteUrl}${path}` }));
}

export function serializeJsonLd(data: Record<string, unknown>) {
  // Content titles/descriptions may contain HTML; never allow a closing script tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function author(siteUrl: string) {
  return { "@type": "Person", "@id": `${siteUrl}/#person`, name: "Yusuf Dere", url: `${siteUrl}/about` };
}

export function websiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      author(siteUrl),
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Yusuf Dere",
        url: `${siteUrl}/`,
        inLanguage: "tr",
        author: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}

export function breadcrumbSchema(siteUrl: string, items: Breadcrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function blogPostingSchema(
  siteUrl: string,
  post: ContentEntry & { excerpt: string | null; category_name: string | null; tags: string[] },
  cover: string | null,
) {
  const url = `${siteUrl}/blog/${encodeURIComponent(post.slug)}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.excerpt || undefined,
    image: cover || undefined,
    datePublished: post.published_at || undefined,
    articleSection: post.category_name || undefined,
    keywords: post.tags.length ? post.tags : undefined,
    inLanguage: "tr",
    author: author(siteUrl),
  };
}

export function projectSchema(siteUrl: string, project: ContentEntry & { description: string }, cover: string | null) {
  const url = `${siteUrl}/projects/${encodeURIComponent(project.slug)}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: project.title,
    description: project.description || undefined,
    url,
    image: cover || undefined,
    datePublished: project.published_at || undefined,
    author: author(siteUrl),
  };
}
