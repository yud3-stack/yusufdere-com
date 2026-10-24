# Single-screen writing showcase

Approved reference: generated preview `exec-7b661b5f-08b6-4bde-9540-1360e8f1d84a.png`.

## Structure and data

`app/blog/page.tsx` stays a server component. It queries only published posts, resolves covers and passes a small serializable view model to `JournalShowcase`. No database/CMS migration. Typed presentation copy and optional artwork overrides live in `data/journal.ts`.

`JournalShowcase` controls selected post and the pair of selector buttons. Previous/next and arrow/Home/End keys update the selection without navigating or scrolling. Native buttons expose pressed state, disabled boundaries and the controlled article; a concise live region announces changes. All published posts remain reachable when there are more than two. The real title, excerpt, date, reading time and detail link are retained.

`JournalCover` uses Next Image with a typographic fallback for missing/failed covers. Missing metadata is omitted. The showcase handles empty and unavailable states without fabricating content.

## Responsive layout

Desktop at 900px and wider: viewport height minus shared header and optional signed-in admin toolbar. Fixed-height selector below a flexible two-column stage. Cover height adapts to long real titles and smaller screens. A shorter-screen breakpoint compacts type and spacing. No footer on `/blog`; article detail pages keep their footer and scrolling.

Refinement after review in the user's Chrome window: content is capped at the shared header's 1280px width, with 32px inner margins. The main headline caps at 74px and article title at 34px. The cover no longer expands to fill all remaining height; it retains its aspect ratio within a 300px/31svh height cap. Removed the secondary motto and repeated count/note, and reduced selector thumbnails. Verified the complete page fits the real 1920×855 Chrome viewport.

Narrow screens: a readable stacked layout with natural scrolling, as discussed with the user. No clipped text or hidden overflow on the full page. Reduced-motion preference disables reveal effects.

## Art

Workspace asset: `public/images/blog/og-editorial-showcase.png`.

The OG entry has a presentation-only monochrome cover. Its original CMS cover and article detail are unchanged. Built-in ImageGen prompt: Create a premium editorial article cover image, landscape 16:9. Main subject: elegant layered translucent frosted-glass browser windows resting on a warm ivory studio surface. Central window contains large beautiful high-contrast black serif letters 'OG' and a small refined subtitle 'Open Graph'. A smaller link-preview glass card overlaps to the right, containing a small monochrome mountain photograph and two fine gray lines representing title and description. Two thin browser frames extend behind at slightly offset angles, visible complete with tiny neutral gray window controls. Calm soft natural studio lighting from upper left, delicate realistic shadows and reflections, frosted glass and paper-like material. Palette entirely warm ivory #faf9f6, silver gray, charcoal, with only a minute olive link icon. Elegant minimal design to match a premium personal editorial website. Strong sharp typography and clean shapes, ample ivory negative space, no busy scene. NOT a complete webpage screenshot. NO navigation, NO people, NO article paragraphs, NO orange, NO watermark, NO extra text beyond 'OG' and 'Open Graph'. High quality subtle photographic 3D material rendering.

## Validation

Production build, TypeScript, targeted ESLint and all 20 existing tests passed. Browser checks verified viewport-sized layouts at 1440×900 and 1366×768, no horizontal overflow at 390×844, next/previous selection, Home-key selection, correct pressed-state changes, loaded covers, and navigation to the real article detail with its footer intact. No browser console errors observed. Mobile retains natural scrolling rather than clipping article information.
