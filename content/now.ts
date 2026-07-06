export type FocusItem = {
  title: string;
  description: string;
  status: string;
};

export const nowPage = {
  eyebrow: "Now",
  title: "The current season of focus.",
  description:
    "A simple snapshot of what Yusuf is working on, learning, and paying attention to right now.",
  lastUpdated: "July 2026",
} as const;

export const focusItems: FocusItem[] = [
  {
    title: "Building PixelBuddy AI",
    description:
      "Clarifying the product, improving core flows, and shaping the first useful version.",
    status: "Active",
  },
  {
    title: "Learning Swift",
    description:
      "Exploring iOS development as a foundation for future mobile products.",
    status: "Learning",
  },
  {
    title: "Preparing stronger systems",
    description:
      "Creating routines for study, health, work, and long-term personal growth.",
    status: "Ongoing",
  },
  {
    title: "Documenting the process",
    description:
      "Turning projects, ideas, and lessons into journal notes and visual records.",
    status: "Quietly",
  },
];
