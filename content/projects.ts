import type { ProjectPreview } from "@/content/home";

export const projectsPage = {
  eyebrow: "Projects",
  title: "Products, experiments, and public traces of what is being built.",
  description:
    "A concise view of current and future software work. Placeholder entries are structured so they can be replaced by Sanity content later.",
} as const;

export const projectItems: ProjectPreview[] = [
  {
    title: "PixelBuddy AI",
    description:
      "An AI assistant for creators and developers, focused on speeding up practical product and content workflows.",
    status: "Building",
    href: "/projects/pixelbuddy-ai",
    accent: "violet",
  },
  {
    title: "Travel Ticket",
    description:
      "A travel discovery and booking concept for routes, places, and memorable trips.",
    status: "Experiment",
    href: "/projects/travel-ticket",
    accent: "stone",
  },
  {
    title: "New SaaS Projects",
    description:
      "A pipeline for small software bets, product ideas, and future startup experiments.",
    status: "Idea",
    href: "/projects/new-saas-projects",
    accent: "slate",
  },
  {
    title: "GitHub",
    description:
      "A public trail of code, learning, prototypes, and technical experiments as the ecosystem grows.",
    status: "Open Source",
    href: "https://github.com/heyyud3",
    accent: "stone",
  },
];
