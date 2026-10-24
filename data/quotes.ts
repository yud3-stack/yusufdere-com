export type DailyQuote = {
  id: string; text: string; original: string; author: string; authorDetail: string;
  sourceTitle: string; sourceLabel: string; sourceNote: string; sourceUrl: string;
  portraitSrc: string; portraitCredit: string;
  discoveryUrl?: string | null;
  portraitSourceUrl?: string | null; portraitLicenseUrl?: string | null;
};
const dijkstra = {
  author: "Edsger W. Dijkstra", authorDetail: "Bilgisayar bilimci",
  portraitSrc: "/images/quotes/edsger-dijkstra.jpg",
  portraitCredit: "Hamilton Richards · CC BY-SA 3.0",
};
// A deliberately small verified collection; expand with primary sources and licensed portraits.
export const dailyQuotes: readonly DailyQuote[] = [
  {
    ...dijkstra, id: "dijkstra-testing",
    text: "Program testi, hataların varlığını gösterebilir; yokluğunu asla.",
    original: "Program testing may convincingly demonstrate the presence of bugs, but can never demonstrate their absence.",
    sourceTitle: "On the cruelty of really teaching computing science · EWD 1036",
    sourceLabel: "E. W. Dijkstra Archive · EWD 1036",
    sourceNote: "Türkçe çeviri · Özgün metin kaynakta",
    sourceUrl: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD10xx/EWD1036.html",
  },
  {
    ...dijkstra, id: "dijkstra-tools",
    text: "Kullandığımız araçlar, düşünme alışkanlıklarımızı derinden ve sinsice etkiler.",
    original: "The tools we use have a profound (and devious!) influence on our thinking habits",
    sourceTitle: "How do we tell truths that might hurt? · EWD 498",
    sourceLabel: "E. W. Dijkstra Archive · EWD 498",
    sourceNote: "Türkçe çeviri · Cümleden alıntı",
    sourceUrl: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html",
  },
  {
    ...dijkstra, id: "dijkstra-elegance",
    text: "Zarafet, vazgeçilebilir bir lüks değildir.",
    original: "elegance is not a dispensable luxury",
    sourceTitle: "Elegance and effective reasoning · EWD 1237",
    sourceLabel: "E. W. Dijkstra Archive · EWD 1237",
    sourceNote: "Türkçe çeviri · Cümleden alıntı",
    sourceUrl: "https://www.cs.utexas.edu/~EWD/transcriptions/EWD12xx/EWD1237.html",
  },
];
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit",
  numberingSystem: "latn",
});
export function quoteDate(now: Date = new Date()): string {
  // Safari/Chrome can ship different CLDR date orders for the same locale.
  // The database key must always be ISO, regardless of display formatting.
  const parts = formatter.formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month").padStart(2, "0")}-${part("day").padStart(2, "0")}`;
}
export function getDailyQuote(date: string): DailyQuote {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Geçersiz söz tarihi");
  const time = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== date)
    throw new Error("Geçersiz söz tarihi");
  const day = Math.floor((time - Date.UTC(2026, 9, 24)) / 86_400_000);
  return dailyQuotes[((day % dailyQuotes.length) + dailyQuotes.length) % dailyQuotes.length];
}
