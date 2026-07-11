export const en = {
  locale: "en",
  nav: {
    about: "About",
    projects: "Projects",
    journal: "Journal",
    gallery: "Gallery",
    uses: "Uses",
    now: "Now",
    contact: "Contact",
  },
  actions: {
    viewProjects: "View Projects",
    aboutMe: "About Me",
    viewProject: "View project",
    viewAllProjects: "View all projects",
    viewAllPosts: "View all posts",
    viewAllPhotos: "View all photos",
    viewFullList: "View full list",
    moreUpdates: "More updates",
    readMore: "Read more",
    backToHome: "Back to home",
    backToJournal: "Back to journal",
    allProjects: "All projects",
    visit: "Visit",
    liveSite: "Live site",
  },
  empty: {
    projects: {
      title: "Projects are being prepared.",
      description:
        "New products, experiments and build logs will appear here soon.",
    },
    journal: {
      title: "Notes will be published soon.",
      description:
        "Short thoughts, development logs and behind-the-scenes notes will live here.",
    },
    gallery: {
      title: "Gallery is not live yet.",
      description:
        "Lifestyle, travel, workspace and photography selections will be added soon.",
    },
    uses: {
      title: "Setup is being curated.",
      description:
        "Tools, devices and everyday workflow items will be listed here soon.",
    },
    now: {
      title: "Now page will be updated soon.",
      description:
        "Current focus, projects and priorities will be shared here.",
    },
  },
  home: {
    heroSupport:
      "A quiet digital home for projects, notes, photography, tools, and the next things taking shape.",
    tagline: "Building the life I imagined.",
    siteDescription:
      "Software, products, notes and photography from Samsun.",
    basedInSamsun: "Based in Samsun",
    aboutLink: "About",
    selectedProjects: "Selected projects",
    projectsTitle: "Focused experiments, products, and systems.",
    projectsDescription:
      "A small selection of things being shaped with care, usefulness, and a long-term point of view.",
    currentFocus: "Current focus",
    latestNotes: "Latest notes",
    toolsAndSetup: "Tools and setup",
  },
  footer: {
    rights: "All rights reserved.",
  },
  share: {
    label: "Share",
    description:
      "Generate a quiet story card from this page for manual sharing.",
    downloadStoryCard: "Download Story Card",
    copyCaption: "Copy Caption",
    copied: "Copied",
    journal: "Journal",
    project: "Project",
    captionReadMore: "Read more",
    captionViewProject: "View project",
  },
  labels: {
    base: "Base",
    focus: "Focus",
    mode: "Mode",
    building: "Building",
    direction: "The direction",
    story: "Story",
    currentFocus: "Current focus",
    highlighted: "Highlighted",
    projectIndex: "Project Index",
    featured: "Featured",
    project: "Project",
    stack: "Stack",
    links: "Links",
    overview: "Overview",
    whyItExists: "Why it exists",
    currentStatus: "Current status",
    status: "Status",
    category: "Category",
    techStack: "Tech stack",
    lastUpdated: "Last updated",
    instagram: "Instagram",
    email: "Email",
  },
  pages: {
    projects: {
      eyebrow: "Projects",
      title: "Products, experiments, and public traces of what is being built.",
      description:
        "A focused index of software work, experiments, and systems being shaped with a long-term point of view.",
      highlightedDescription:
        "A closer look at the work currently carrying the most signal.",
      indexTitle: "More work in motion.",
      indexDescription:
        "Small bets, product ideas, and useful systems as they move from note to build.",
    },
    journal: {
      eyebrow: "Journal",
      title: "Short notes from the process.",
      description:
        "Development logs, behind-the-scenes thinking, and personal notes. Calm, direct, and intentionally lighter than a formal blog.",
    },
    gallery: {
      eyebrow: "Gallery",
      title: "Visual notes without becoming a feed.",
      description:
        "A future home for photography, travel, city moments, workspace details, and the visual side of YusufDere.com.",
    },
    uses: {
      eyebrow: "Uses",
      title: "Tools for building, writing, and staying organized.",
      description:
        "A replaceable placeholder list for the devices, software, apps, and daily tools behind the work.",
    },
    now: {
      eyebrow: "Now",
      title: "The current season of focus.",
      description:
        "A simple snapshot of what Yusuf is working on, learning, and paying attention to right now.",
      lastUpdated: "July 2026",
    },
    contact: {
      eyebrow: "Contact",
      title: "A simple way to reach out.",
      description:
        "For product ideas, collaborations, thoughtful notes, or anything connected to what Yusuf is building next.",
      homeTitle: "Let's connect.",
      homeDescription:
        "For projects, ideas, collaborations, or quiet notes about what is being built next.",
    },
    about: {
      fallbackLocation: "Samsun, Turkiye",
      closingPrefix: "This is the home of",
      closingBody:
        "a personal brand system for connecting product work, journal notes, photography, current focus, and the future experiments that start in",
    },
  },
} as const;

type WidenDictionary<T> = T extends string
  ? string
  : T extends Record<string, unknown>
    ? { [K in keyof T]: WidenDictionary<T[K]> }
    : T;

export type Dictionary = WidenDictionary<typeof en>;
