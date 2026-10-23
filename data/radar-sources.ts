export type RadarSource = {
  id: string;
  name: string;
  feedUrl: string;
};

/** Curated RSS/Atom feeds for the weekly software Radar. Dev.to intentionally omitted for v1. */
export const radarSources: RadarSource[] = [
  { id: "hn-frontpage", name: "Hacker News", feedUrl: "https://hnrss.org/frontpage" },
  { id: "hn-best", name: "Hacker News Best", feedUrl: "https://hnrss.org/best" },
  { id: "nextjs", name: "Next.js Blog", feedUrl: "https://nextjs.org/feed.xml" },
  { id: "vercel", name: "Vercel Blog", feedUrl: "https://vercel.com/atom" },
  { id: "supabase", name: "Supabase Blog", feedUrl: "https://supabase.com/rss.xml" },
  { id: "github", name: "GitHub Blog", feedUrl: "https://github.blog/feed/" },
  { id: "nodejs", name: "Node.js Blog", feedUrl: "https://nodejs.org/en/feed/blog.xml" },
  { id: "css-tricks", name: "CSS-Tricks", feedUrl: "https://css-tricks.com/feed/" },
  { id: "smashing", name: "Smashing Magazine", feedUrl: "https://www.smashingmagazine.com/feed/" },
];
