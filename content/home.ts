import type { IconKey } from "@/lib/icons";

export type ProjectPreview = {
  title: string;
  description: string;
  status: string;
  category?: string;
  techStack: string[];
  featured: boolean;
  href: string;
  accent: "violet" | "stone" | "slate";
};

export type NowItem = {
  title: string;
  description: string;
  icon: IconKey;
};

export type JournalPreview = {
  title: string;
  excerpt: string;
  date: string;
  href: string;
};

export type GalleryPreview = {
  title: string;
  location: string;
};

export type UsesItem = {
  title: string;
  category: string;
  categoryLabel?: string;
  icon: IconKey;
};

export const homeIntro = {
  eyebrow: "About",
  title:
    "A personal hub for what Yusuf is building, noticing, and becoming.",
  body:
    "YusufDere.com is the center of the work: projects in progress, quiet notes, visual moments, tools, and the current season of focus. Calm on the surface, intentional underneath.",
  href: "/about",
} as const;

export const featuredProjects: ProjectPreview[] = [
  {
    title: "PixelBuddy AI",
    description:
      "An AI assistant for creators and developers, shaped around speed, clarity, and daily workflow.",
    status: "Building",
    category: "AI",
    techStack: ["AI", "Product", "Automation"],
    featured: true,
    href: "/projects/pixelbuddy-ai",
    accent: "violet",
  },
  {
    title: "Travel Ticket",
    description:
      "A modern travel planning concept for discovering routes, tickets, and memorable places.",
    status: "Experiment",
    category: "Web",
    techStack: ["Next.js", "Product", "Travel"],
    featured: false,
    href: "/projects/travel-ticket",
    accent: "stone",
  },
  {
    title: "New SaaS Projects",
    description:
      "A quiet pipeline of software ideas, small bets, and systems for future products.",
    status: "Idea",
    category: "SaaS",
    techStack: ["Systems", "Research", "Product"],
    featured: false,
    href: "/projects/new-saas-projects",
    accent: "slate",
  },
];

export const nowItems: NowItem[] = [
  {
    title: "Building PixelBuddy AI",
    description: "Refining the product direction and core assistant experience.",
    icon: "code",
  },
  {
    title: "Learning Swift",
    description: "Exploring iOS development with a long-term product lens.",
    icon: "sparkles",
  },
  {
    title: "Reading and resetting",
    description: "Keeping the pace calm while building stronger daily systems.",
    icon: "book",
  },
];

export const journalPreviews: JournalPreview[] = [
  {
    title: "Why I am building PixelBuddy",
    excerpt: "A short note on useful tools, momentum, and building in public.",
    date: "May 12, 2026",
    href: "/journal/why-i-am-building-pixelbuddy",
  },
  {
    title: "Designing a quieter internet home",
    excerpt: "Why this site should feel personal without becoming casual.",
    date: "Apr 28, 2026",
    href: "/journal/designing-a-quieter-internet-home",
  },
  {
    title: "The current season",
    excerpt: "Projects, discipline, learning, and the shape of the next step.",
    date: "Apr 10, 2026",
    href: "/journal/the-current-season",
  },
];

export const galleryPreviews: GalleryPreview[] = [
  { title: "Coastal evening", location: "Samsun" },
  { title: "City walk", location: "Night notes" },
  { title: "Open road", location: "Travel" },
  { title: "Coffee table", location: "Workspace" },
];

export const usesItems: UsesItem[] = [
  { title: "MacBook Pro", category: "Hardware", icon: "laptop" },
  { title: "iPhone", category: "Hardware", icon: "phone" },
  { title: "Sony Camera", category: "Hardware", icon: "camera" },
  { title: "AirPods Pro", category: "Everyday Carry", icon: "headphones" },
  { title: "VS Code", category: "Software", icon: "code" },
  { title: "Notion", category: "Apps", icon: "app" },
];
