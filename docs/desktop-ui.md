# Yusuf Dere desktop UI

The approved UI is a single light theme focused on projects and writing. Home,
Projects, Journal and About all run inside the same desktop workspace.

The visual direction is now Windows / Linux, based on the user's desktop and
File Explorer references. Home starts with no open windows, a branded pale-blue
wallpaper, and left-aligned folders/documents. The full-width bottom taskbar has
a Start launcher, search, open-window indicators, language switcher, local clock,
and a Show desktop action. No simulated system settings or fake battery data.

`FileExplorer` provides sidebar navigation, breadcrumbs, folder search, sorting,
icon/list views and single-click selection / double-click opening. Keyboard Enter
and touch open immediately. Projects are represented as PDF-style documents,
journal entries as DOCX-style reading documents. These are HTML views of the
existing CMS content, not actual stored PDF/DOCX files. `DocumentViewer` supplies
zoom, read-only document chrome, a paper surface and print / save-as-PDF through
the browser's print dialog. Existing schemas and URLs remain unchanged.

## Components and content

`DesktopSite` fetches published Sanity content on the server and validates direct
project/article links. `DesktopWorkspace` owns the client interactions;
`useWindowManager` owns window positions, dimensions, stacking, minimize/restore
and close. `AppWindow` renders accessible window controls and handles pointer
dragging and resizing. Separate application components render the project
library, project details, article library, article reader, Home and About.

The existing `project`, `journalPost`, `siteSettings` and `aboutPage` schemas are
retained. Search uses the same localized published content as the applications,
including real slugs and cover images. Each project or article has its own
window identity, so multiple detail windows can remain open together.

## Navigation and interaction

Ordinary links open/focus windows without replacing the desktop. Modified links
retain normal browser behavior for opening a new tab. The History API updates
the address, and back/forward focuses or reopens the corresponding window.
The existing Next.js routes still render the workspace on direct visits, keep
server metadata, and return 404 for missing content.

The title bar moves windows and double-click toggles maximize. The bottom-right
grip resizes a window, including with arrow keys when focused. Window geometry
stays within the workspace. The taskbar toggles app minimize/restore and also
shows open detail windows on desktop. Minimizing preserves application state;
closing removes that window.

The launcher and taskbar search controls, or Ctrl/Cmd+K, open a native modal dialog.
The dialog traps focus, supports arrow keys/Enter and Escape, and searches
projects and published articles. Locale switches perform a normal route
navigation with the corresponding localized content.

## Responsive behavior

Desktop windows overlap inside a viewport-sized workspace; content scrolls
inside each window. Below 768px only the focused window is shown, fitted to the
available screen above the taskbar. Moving and resizing are disabled on mobile.
Project grids and Home adapt to the window's own width using container queries.
The taskbar respects mobile safe areas. Window layouts reset on a page reload;
the current content is restored from the URL.
