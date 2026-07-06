export type JournalEntry = {
  title: string;
  excerpt: string;
  category: "Thought" | "Development Log" | "Behind the Scenes" | "Life Note";
  date: string;
  href: string;
};

export const journalPage = {
  eyebrow: "Journal",
  title: "Short notes from the process.",
  description:
    "Development logs, behind-the-scenes thinking, and personal notes. Calm, direct, and intentionally lighter than a formal blog.",
} as const;

export const journalEntries: JournalEntry[] = [
  {
    title: "Why I am building PixelBuddy",
    excerpt:
      "A note on useful AI, daily momentum, and keeping the product close to real work.",
    category: "Development Log",
    date: "May 12, 2026",
    href: "/journal/why-i-am-building-pixelbuddy",
  },
  {
    title: "Designing a quieter internet home",
    excerpt:
      "Why a personal hub should feel focused without becoming corporate or loud.",
    category: "Behind the Scenes",
    date: "Apr 28, 2026",
    href: "/journal/designing-a-quieter-internet-home",
  },
  {
    title: "The current season",
    excerpt:
      "Projects, learning, discipline, and the kind of pace that can actually last.",
    category: "Life Note",
    date: "Apr 10, 2026",
    href: "/journal/the-current-season",
  },
  {
    title: "What makes a project feel alive",
    excerpt:
      "A short thought on prototypes, taste, and the moment an idea starts to pull back.",
    category: "Thought",
    date: "Mar 22, 2026",
    href: "/journal/what-makes-a-project-feel-alive",
  },
];
