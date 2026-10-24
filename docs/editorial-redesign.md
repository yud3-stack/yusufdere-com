# Editorial redesign

User-approved replacement of the previous orange split hero with the portrait concept.

## Structure

- Shared shell: ivory page frame, YD wordmark, pill navigation, compact search and contact action.
- Hero: server component with typed copy, isolated grayscale portrait, decorative perspective panels and four real links/cards.
- QuoteCard: client component with native accessible dialog, verified source, copy, image generation/download and device-dependent native sharing.
- Existing published project/post queries populate the hero links. The homepage contains only the portrait scene; archives remain accessible through navigation and the cards.
- Archives, detail pages, about, footer and cookie/search interfaces share the editorial stylesheet.

## Content

No CMS migration. The current repository uses Supabase. Existing post/project schemas and publication filters remain intact. Hero copy and a verified quotation live in data/hero.ts. The quote is an initial curated entry; an automatically rotating daily archive is a separate content feature.

## Responsive behavior

Desktop: full-bleed, square-edged scene sized to the viewport, keeping the signed-in admin toolbar. Smaller peripheral cards, curved panels and a central portrait follow the reference composition. No lower homepage content or homepage footer. Tablet: reduced panel size and card spacing. Mobile: portrait and decorative panels followed by a readable two-column card grid, collapsing to a single column on narrow screens. Gentle staggered entrances and six-pixel floating motion add depth. Reduced-motion preference disables animations and transitions; mobile cards have entrance animation only.

The two central call-to-action buttons were removed to keep the portrait unobstructed; navigation and the project/post cards remain the entry points. The portrait is enlarged on desktop and mobile, with more compact heading typography on short desktop viewports to preserve clearance above the hair.

The background now uses live HTML interface studies for RequestLab and WinSoundMixer rather than the decorative life-code block and stock microphone image. These are conceptual project-inspired panels, not product screenshots. Their complete window corners use a modest consistent radius and reduced perspective. The introduction uses 18px text on desktop and 15px on mobile, with a larger portrait positioned lower to leave it clear space.

The latest-writing card now sits separately in the lower-left space rather than covering the RequestLab panel. Narrower desktop breakpoints preserve that separation, and the scene stacks at 850px and below. Background panel and glass angles remain fixed after loading; removed the continuous rotational sway, keeping the entrance fade and gentle vertical card movement.

## Portrait

Derived from the user-supplied photograph with the built-in image generation tool. The current v2 outpaints both shoulders, sleeves and torso to eliminate the original image's straight cropped shoulder edge. Transparent grayscale PNG stored in public/images/hero/yusuf-portrait-complete-v2.png. The previous version is preserved. Exact v2 prompt is in docs/references/portrait-v2-prompt.md.

Exact generation prompt:

> Edit target: the attached portrait. Background extraction for real website portrait asset. Remove the entire tan wall background to real alpha transparency. Keep EXACT same real person's identity, facial features, hairstyle, side-looking pose looking left, T-shirt, necklace, proportions and all natural detail. Convert person to premium photographic black and white with realistic fine detail and balanced contrast. Crop unused space above head so hair starts near upper edge, include head shoulders chest until lower frame. Output only the isolated person on transparent background, no UI, no text, no frame, no shadows behind person, no newly imagined face, no background. Preserve original photographic identity. Portrait orientation.

## Validation

Production build, TypeScript and all 20 existing tests passed. ESLint reports only two pre-existing unused-argument warnings in lib/radar/actions.ts. Browser checks cover desktop/mobile layouts, source dialog, quote PNG download, mobile navigation and about-page card positioning.

## Sharing

No automatic posting or authentication. X and WhatsApp open text composers. The portrait-independent quote graphic is generated locally as a 1080 × 1920 PNG. File sharing checks device support and requires a separate fresh click after generation; unsupported environments receive a download. Instagram/TikTok composer selection is controlled by the operating system and receiving application.
