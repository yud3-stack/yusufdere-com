import { createHash } from "node:crypto";
import { quoteAuthors, quoteSourceHosts } from "../../data/quote-sources.ts";

export type QuoteCandidate = {
  id: string; original: string; author: string; author_detail: string;
  source_url: string; source_title: string; discovery_url: string;
  discovery_revision: number; source_matched: boolean;
  portrait_src: string; portrait_credit: string;
};

export function plainText(value: string): string {
  return value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ").replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, "$1")
    .replace(/\{\{[^{}]*\}\}/g, " ").replace(/'{2,5}/g, "")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code: string) => {
      const point = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : " ";
    })
    .replace(/&(amp|lt|gt|quot|apos|nbsp|mdash|ndash|ldquo|rdquo|lsquo|rsquo);/g,
      (_, entity: string) => ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", mdash: "—", ndash: "–", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’" })[entity] ?? " ")
    .replace(/\s+/g, " ").trim();
}

export function safeSourceUrl(raw: string): string | null {
  try {
    const url = new URL(raw.replace(/^http:/, "https:"));
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
      !(quoteSourceHosts as readonly string[]).includes(url.hostname)) return null;
    url.hash = "";
    if (/^(www\.)?cs\.utexas\.edu$/.test(url.hostname)) {
      url.pathname = url.pathname.replace(/^\/users\/EWD\//, "/~EWD/")
        .replace(/^\/~EWD\/ewd(\d{2})xx\/(EWD\d+)\.PDF$/i, "/~EWD/transcriptions/EWD$1xx/$2.html");
    }
    return url.toString();
  } catch { return null; }
}

export function quoteFingerprint(author: string, original: string): string {
  return createHash("sha256").update(`${author.toLowerCase()}\n${normalize(original)}`).digest("hex");
}
function normalize(text: string) {
  return plainText(text).normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}
export function sourceContainsQuote(source: string, quote: string): boolean {
  return normalize(quote).length >= 25 && normalize(source).includes(normalize(quote));
}

// Wikiquote quotations use top-level bullets; their citation is nested below.
// Unknown/misattributed/quotes-about sections never enter the review queue.
export function extractSourcedQuotes(wikitext: string): { original: string; sourceUrl: string; sourceTitle: string }[] {
  const result: { original: string; sourceUrl: string; sourceTitle: string }[] = [];
  let excludedLevel = 0;
  let quote = "";
  for (const line of wikitext.split("\n")) {
    const heading = line.match(/^(={2,6})\s*(.*?)\s*\1\s*$/);
    if (heading) {
      const level = heading[1].length;
      if (excludedLevel && level <= excludedLevel) excludedLevel = 0;
      if (!excludedLevel && /unsourced|disputed|misattributed|attributed|quotes about|external links|unknown date/i.test(heading[2])) excludedLevel = level;
      quote = "";
      continue;
    }
    if (excludedLevel) continue;
    if (/^\*[^*:]/.test(line)) { quote = plainText(line.slice(1)); continue; }
    if (!quote || !/^\*\*/.test(line)) continue;
    if (quote.length < 30 || quote.length > 320 || !/program|software|comput|algorithm|debug|\bcode\b|complexity|simplicity|abstraction/i.test(quote)) continue;
    for (const match of line.matchAll(/https?:\/\/[^\s\]<>{}|]+/g)) {
      const url = safeSourceUrl(match[0]);
      if (!url) continue;
      result.push({ original: quote, sourceUrl: url, sourceTitle: plainText(line.replace(/^\*+\s*/, "")).slice(0, 240) });
      quote = "";
      break;
    }
  }
  return result;
}

async function readRemote(url: string, timeout = 7000, redirects = 0, deadline?: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    headers: { "User-Agent": "YusufDereQuotes/1.0 (https://www.yusufdere.com)", Accept: "application/json,text/html;q=0.9" },
    signal: deadline ? AbortSignal.any([deadline, AbortSignal.timeout(timeout)]) : AbortSignal.timeout(timeout), redirect: "manual", cache: "no-store",
  });
  if ([301, 302, 303, 307, 308].includes(response.status) && redirects < 3) {
    const location = response.headers.get("location");
    const next = location ? safeSourceUrl(new URL(location, url).toString()) : null;
    if (next && next !== url) return readRemote(next, timeout, redirects + 1, deadline);
  }
  if (!response.ok || !response.body) throw new Error(`Kaynak erişilemiyor (${response.status}).`);
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 1_500_000) throw new Error("Kaynak boyutu sınırı aşıldı.");
      chunks.push(value);
    }
  } finally { await reader.cancel(); }
  return Buffer.concat(chunks).toString("utf8");
}

export type DiscoveryProgress = { cursors?: Record<string, number>; authorOffset?: number; authorCounts?: Record<string, number> };

export function selectDiscoveryAuthors(progress: DiscoveryProgress = {}) {
  const start = (progress.authorOffset ?? 0) % quoteAuthors.length;
  const rotated = [...quoteAuthors.slice(start), ...quoteAuthors.slice(0, start)];
  const priority = [...rotated].sort((a, b) => (progress.authorCounts?.[a.name] ?? 0) - (progress.authorCounts?.[b.name] ?? 0)).slice(0, 3);
  // Reserve one rotating slot, so a productive author is not permanently
  // excluded by authors whose citations are all inaccessible.
  const explorer = [...rotated.slice(3), ...rotated.slice(0, 3)].find((author) => !priority.includes(author));
  return explorer ? [...priority, explorer] : priority;
}

export async function discoverQuotes(_day: string, knownIds: ReadonlySet<string> = new Set(), signal?: AbortSignal, progress: DiscoveryProgress = {}) {
  const deadline = signal ? AbortSignal.any([signal, AbortSignal.timeout(20_000)]) : AbortSignal.timeout(20_000);
  void _day;
  const authors = selectDiscoveryAuthors(progress);
  const candidates: QuoteCandidate[] = [];
  const warnings: string[] = [];
  const cursors = { ...progress.cursors };
  const stats = { authors: [] as string[], eligible: 0, known: 0, unavailable: 0, unmatched: 0, sourceRequests: 0 };
  const queues: { author: (typeof quoteAuthors)[number]; entries: ReturnType<typeof extractSourcedQuotes>; revision: number; position: number; walked: number }[] = [];
  let checks = 0;
  for (const author of authors) {
    if (deadline.aborted) break;
    stats.authors.push(author.name);
    try {
      const api = new URL("https://en.wikiquote.org/w/api.php");
      api.search = new URLSearchParams({ action: "parse", page: author.page, prop: "wikitext|revid", format: "json", formatversion: "2", redirects: "1" }).toString();
      const body = JSON.parse(await readRemote(api.toString(), 7000, 0, deadline)) as { parse?: { wikitext?: string; revid?: number } };
      if (!body.parse?.wikitext || !body.parse.revid) throw new Error("Kaynak sayfası okunamadı.");
      const entries = extractSourcedQuotes(body.parse.wikitext);
      stats.eligible += entries.length;
      if (!entries.length) { warnings.push(`${author.name}: desteklenen özgün kaynak bağlantısı bulunamadı.`); continue; }
      queues.push({ author, entries, revision: body.parse.revid, position: (cursors[author.name] ?? 0) % entries.length, walked: 0 });
    } catch { warnings.push(`${author.name}: kaynak şu an okunamadı.`); }
  }
  const sources = new Map<string, string | null>();
  while (!deadline.aborted && checks < 8 && candidates.length < 4 && queues.some((queue) => queue.walked < queue.entries.length)) {
    for (const queue of queues) {
      if (deadline.aborted || checks >= 8 || candidates.length >= 4) break;
      const { author, entries } = queue;
      // One attempt per author per round. Advance on failures and duplicates.
      while (queue.walked < entries.length) {
        const entry = entries[queue.position];
        queue.position = (queue.position + 1) % entries.length;
        queue.walked++;
        cursors[author.name] = queue.position;
        const id = quoteFingerprint(author.name, entry.original);
        if (knownIds.has(id) || candidates.some((candidate) => candidate.id === id)) { stats.known++; continue; }
        checks++;
        if (!sources.has(entry.sourceUrl)) {
          stats.sourceRequests++;
          try { sources.set(entry.sourceUrl, await readRemote(entry.sourceUrl, 3500, 0, deadline)); }
          catch { sources.set(entry.sourceUrl, null); }
        }
        const source = sources.get(entry.sourceUrl);
        if (!source) stats.unavailable++;
        else if (!sourceContainsQuote(source, entry.original)) stats.unmatched++;
        else {
          candidates.push({ id, original: entry.original, author: author.name, author_detail: author.detail,
            source_url: entry.sourceUrl, source_title: entry.sourceTitle,
            discovery_url: `https://en.wikiquote.org/w/index.php?title=${encodeURIComponent(author.page)}&oldid=${queue.revision}`,
            discovery_revision: queue.revision, source_matched: true,
            portrait_src: author.portrait, portrait_credit: author.credit });
        }
        break;
      }
    }
  }
  return { candidates, warnings, checks, stats, cursors, authorOffset: ((progress.authorOffset ?? 0) + 1) % quoteAuthors.length };
}
