# Technical SEO

- Canonical production origin: `https://www.yusufdere.com`. Both production aliases in `NEXT_PUBLIC_SITE_URL` normalize to this origin; custom local origins remain supported.
- Home sets its own canonical. Other public pages use their existing page-specific metadata through `getSiteUrl()`. There is no inherited homepage canonical on admin or missing pages.
- `/sitemap.xml` lists `/`, `/blog`, `/projects`, `/about`, `/privacy`, and the existing published post/project query results. It excludes admin and draft content. It fails on query errors instead of serving a misleading incomplete sitemap.
- Sitemap uses hourly revalidation and the existing tagged Supabase query cache. Existing publish/unpublish tag invalidation applies without modifying Server Actions. No synthetic modification dates or priorities are emitted.
- `/robots.txt` allows public crawling, excludes admin/API paths and points to the canonical sitemap. Existing admin `noindex` and authentication remain in place.
- Home emits `WebSite` and `Person`; blog details emit `BlogPosting`; project details retain `CreativeWork`. Both detail types include `BreadcrumbList`.
- Structured data uses real content and omits absent covers/dates/categories. JSON-LD serialization escapes `<` to prevent content from closing the script element.
- Default social sharing image: `/images/og/yusuf-dere-portrait-yd-v3.png` (1730 × 909), using the approved portrait and bold YD logo. Open Graph and Twitter metadata use the real content cover first, with this branded sharing card as fallback. This does not add cover images to visible content cards or structured data.
- Favicon assets use the YD monogram: `app/icon.svg`, `app/favicon.ico` (16/32/48/64px) and `app/apple-icon.png` (180px). Next.js emits their link tags automatically.

After deployment, check both metadata endpoints and a real blog/project page. If a CDN replaces `/robots.txt`, its configuration must preserve the origin rules and sitemap line. Search Console sitemap submission and Google Rich Results testing are separate follow-up steps; structured data does not guarantee rich results.

References: [Next.js metadata routes](https://nextjs.org/docs/app/api-reference/file-conventions/metadata), [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld), [Google Article markup](https://developers.google.com/search/docs/appearance/structured-data/article).
