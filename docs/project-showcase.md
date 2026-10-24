# Project showcase

Current design follows approved concept `exec-cdb499fb-dffe-4d1c-b5a4-746706c4defb.png`: product-first layout, with a vertical project directory on the left and selected product detail on the right. Removed the previous large serif slogan and bottom selector. Shared 1280px alignment and ivory shell remain; product names now use strong sans-serif, technical labels use monospace, and the application studies use dark functional UI rather than pale editorial illustration. Desktop remains viewport-sized. Mobile uses a compact two-column selector above the product detail and natural scrolling. Detail routes and the admin toolbar remain intact.

The route remains a server component and queries existing published Supabase projects. No schema migration. The client view receives only the summary and resolved URLs. Previous/next, direct directory buttons and arrow (both horizontal and vertical)/Home/End keyboard controls select projects in groups of four, supporting future entries beyond the current four. Real descriptions, technology names, GitHub/demo links and detail routes are retained. Short display taglines and product introductions are typed presentation copy; the original full summary appears in the 'Ne çözüyor?' section.

Known projects have typed visual kinds in `data/project-showcase.ts`. When a CMS cover exists it is used; missing/failed covers use project-inspired HTML/CSS application windows instead of an empty image placeholder. These have a visible 'Temsili uygulama görünümü' caption; they are not claimed to be actual screenshots. Decorative sliders and window controls are noninteractive. Unknown projects receive a generic product visual. No external image service or new dependency.

No automatic animation of angles. Selected content fades gently; reduced-motion preference disables reveals. No autoplay or publication changes.

## Validation

Production build, TypeScript, targeted ESLint and all 20 existing tests passed. Chrome verification covered selection of all four entries, arrow/Home/End controls, real GitHub/demo URLs, and navigation into the existing WinSoundMixer detail page with its footer intact. The showcase fits 1920×855 and 1366×768 without vertical or horizontal page overflow. Mobile at 390×844 has no horizontal overflow and uses the heading → visual → details order. Chrome reports the existing ColorZilla `cz-shortcut-listen` body-attribute hydration warning from the installed extension.
