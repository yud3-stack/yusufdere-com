export const siteConfig = {
  name: "Yusuf Dere",
  initials: "YD",
  tagline: "Building the life I imagined.",
  location: "Samsun, Türkiye",
  instagramHandle: "@heyyud3",
  instagramUrl: "https://www.instagram.com/heyyud3",
  description:
    "A premium personal hub for projects, writing, photography, tools, and what Yusuf Dere is building now.",
  primaryAction: {
    label: "Explore the foundation",
    href: "#foundation",
  },
} as const;

export type SiteConfig = typeof siteConfig;
