export const siteConfig = {
  name: "Yusuf Dere",
  initials: "YD",
  tagline: "Building the life I imagined.",
  location: "Samsun, Türkiye",
  email: "hello@yusufdere.com",
  instagramHandle: "@heyyud3",
  instagramUrl: "https://www.instagram.com/heyyud3",
  description:
    "A premium personal hub for projects, writing, photography, tools, and what Yusuf Dere is building now.",
  primaryAction: {
    label: "View Projects",
    href: "/projects",
  },
} as const;

export type SiteConfig = typeof siteConfig;
