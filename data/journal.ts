export const journal = {
  eyebrow: "Notlar / Yazılar",
  title: "Düşündüklerim,",
  titleEmphasis: "öğrendiklerim.",
  description: "Yazılım, projeler ve yol boyunca aldığım notlar.",
} as const;

// Display artwork for the writing showcase; the original CMS cover remains intact.
export const journalArtwork: Readonly<Record<string, string>> = {
  "og-gorsel-nedir-nextjs-nasil-kullanilir":
    "/images/blog/og-editorial-showcase.png",
};
