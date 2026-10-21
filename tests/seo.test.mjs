import { test } from "node:test";
import assert from "node:assert/strict";
import { getSiteUrl } from "../lib/site.ts";
import { buildSitemap, serializeJsonLd, blogPostingSchema, projectSchema, breadcrumbSchema } from "../lib/seo.ts";

const siteUrl = "https://www.yusufdere.com";

test("production aliases resolve to the HTTPS www canonical without affecting custom environments", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    for (const value of ["", "https://yusufdere.com/", "http://www.yusufdere.com"]) {
      process.env.NEXT_PUBLIC_SITE_URL = value;
      assert.equal(getSiteUrl(), siteUrl);
    }
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000/";
    assert.equal(getSiteUrl(), "http://localhost:3000");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  }
});

test("sitemap contains only known public routes and supplied published slugs, without invented lastmod", () => {
  const sitemap = buildSitemap(siteUrl, [{ slug: "test-post" }, { slug: "test-post" }], [{ slug: "test-project" }]);
  assert.deepEqual(sitemap.map(entry => entry.url), [
    `${siteUrl}/`, `${siteUrl}/blog`, `${siteUrl}/projects`, `${siteUrl}/about`, `${siteUrl}/privacy`,
    `${siteUrl}/blog/test-post`, `${siteUrl}/projects/test-project`,
  ]);
  assert.ok(sitemap.every(entry => !("lastModified" in entry)));
  assert.equal(buildSitemap(siteUrl, [], []).length, 5);
});

test("JSON-LD cannot terminate its script tag even with malicious content", () => {
  const title = '</script><script>alert("test")</script>';
  const output = serializeJsonLd({ headline: title });
  assert.ok(!output.includes("<"));
  assert.equal(JSON.parse(output).headline, title);
});

test("missing covers, dates and categories remain absent rather than being replaced with demo values", () => {
  const post = { title: "Test", slug: "test", published_at: null, excerpt: null, category_name: null, tags: [] };
  const article = JSON.parse(serializeJsonLd(blogPostingSchema(siteUrl, post, null)));
  assert.equal(article["@type"], "BlogPosting");
  for (const key of ["image", "datePublished", "dateModified", "articleSection", "keywords", "description"]) {
    assert.ok(!(key in article));
  }
  assert.equal(article.mainEntityOfPage["@id"], `${siteUrl}/blog/test`);
  const project = JSON.parse(serializeJsonLd(projectSchema(siteUrl, { ...post, description: "" }, null)));
  assert.equal(project["@type"], "CreativeWork");
  assert.ok(!("image" in project));
  assert.ok(!("datePublished" in project));
});

test("real publication date and cover are preserved and breadcrumb positions are sequential", () => {
  const article = blogPostingSchema(siteUrl, {
    title: "Test", slug: "test", published_at: "2026-10-17T12:00:00Z", excerpt: "Excerpt", category_name: "Web", tags: ["Next.js"],
  }, "https://example.com/cover.png");
  assert.equal(article.datePublished, "2026-10-17T12:00:00Z");
  assert.equal(article.image, "https://example.com/cover.png");
  const breadcrumb = breadcrumbSchema(siteUrl, [{ name: "Ana Sayfa", path: "/" }, { name: "Blog", path: "/blog" }]);
  assert.deepEqual(breadcrumb.itemListElement.map(item => item.position), [1, 2]);
  assert.equal(breadcrumb.itemListElement[1].item, `${siteUrl}/blog`);
});
