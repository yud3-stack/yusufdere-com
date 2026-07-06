import type { IconKey } from "@/lib/icons";

export type UsesCategory =
  | "Hardware"
  | "Software"
  | "Apps"
  | "Everyday Carry";

export type UsesPageItem = {
  title: string;
  category: UsesCategory;
  description: string;
  icon: IconKey;
};

export const usesPage = {
  eyebrow: "Uses",
  title: "Tools for building, writing, and staying organized.",
  description:
    "A replaceable placeholder list for the devices, software, apps, and daily tools behind the work.",
} as const;

export const usesItems: UsesPageItem[] = [
  {
    title: "MacBook Pro",
    category: "Hardware",
    description: "Primary machine for development, design, writing, and planning.",
    icon: "laptop",
  },
  {
    title: "iPhone",
    category: "Hardware",
    description: "Daily device for capture, communication, and quick notes.",
    icon: "phone",
  },
  {
    title: "VS Code",
    category: "Software",
    description: "Main coding environment for web and product work.",
    icon: "code",
  },
  {
    title: "Cursor",
    category: "Software",
    description: "AI-assisted development space for moving faster with care.",
    icon: "bot",
  },
  {
    title: "Notion",
    category: "Apps",
    description: "Planning, notes, systems, references, and personal organization.",
    icon: "app",
  },
  {
    title: "AirPods Pro",
    category: "Everyday Carry",
    description: "Focus, calls, walks, and quiet work sessions.",
    icon: "headphones",
  },
];
