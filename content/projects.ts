import type { ProjectPreview } from "@/content/home";

export const projectsPage = {
  eyebrow: "Projects",
  title: "Products, experiments, and public traces of what is being built.",
  description:
    "A focused index of software work, experiments, and systems being shaped with a long-term point of view.",
} as const;

export const projectItems: ProjectPreview[] = [
  {
    title: "PixelBuddy AI",
    description:
      "An AI assistant for creators and developers, focused on speeding up practical product and content workflows.",
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
      "A travel discovery and booking concept for routes, places, and memorable trips.",
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
      "A pipeline for small software bets, product ideas, and future startup experiments.",
    status: "Idea",
    category: "SaaS",
    techStack: ["Systems", "Research", "Product"],
    featured: false,
    href: "/projects/new-saas-projects",
    accent: "slate",
  },
  {
    title: "GitHub",
    description:
      "A public trail of code, learning, prototypes, and technical experiments as the ecosystem grows.",
    status: "Open Source",
    category: "Open Source",
    techStack: ["Code", "Learning", "Prototypes"],
    featured: false,
    href: "/projects/github",
    accent: "stone",
  },
];
