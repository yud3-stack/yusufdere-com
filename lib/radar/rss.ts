import "server-only";
import { radarSources, type RadarSource } from "@/data/radar-sources";
import { daysAgoIso } from "./week";

export type RadarCandidate = {
  title: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string | null;
};

function decodeXml(value: string) {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

function tagContent(block: string, tag: string) {
  const cdata = block.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`, "i"));
  if (cdata?.[1]) return decodeXml(cdata[1]);
  const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return plain?.[1] ? decodeXml(plain[1]) : "";
}

function linkFromBlock(block: string) {
  const atom = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i);
  if (atom?.[1]) return decodeXml(atom[1]);
  const rss = tagContent(block, "link");
  return rss;
}

function publishedFromBlock(block: string) {
  const raw =
    tagContent(block, "pubDate") ||
    tagContent(block, "published") ||
    tagContent(block, "updated") ||
    tagContent(block, "dc:date");
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function parseFeed(xml: string, source: RadarSource): RadarCandidate[] {
  const blocks = [
    ...xml.matchAll(/<item\b[\s\S]*?<\/item>/gi),
    ...xml.matchAll(/<entry\b[\s\S]*?<\/entry>/gi),
  ].map(match => match[0]);

  const items: RadarCandidate[] = [];
  for (const block of blocks) {
    const title = tagContent(block, "title");
    const url = linkFromBlock(block);
    if (!title || !url) continue;
    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) continue;
      items.push({
        title,
        url: parsed.toString(),
        sourceId: source.id,
        sourceName: source.name,
        publishedAt: publishedFromBlock(block),
      });
    } catch {
      // skip invalid urls
    }
  }
  return items;
}

async function fetchSource(source: RadarSource): Promise<{ items: RadarCandidate[]; error: string | null }> {
  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
        "User-Agent": "yusufdere-admin-radar/1.0",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      return { items: [], error: `${source.name}: HTTP ${response.status}` };
    }
    // Large Atom feeds (e.g. Vercel) can be multi‑MB; recent entries sit near the top.
    const xml = (await response.text()).slice(0, 450_000);
    const items = parseFeed(xml, source);
    if (!items.length) {
      return { items: [], error: `${source.name}: feed boş veya okunamadı` };
    }
    return { items, error: null };
  } catch {
    return { items: [], error: `${source.name}: feed alınamadı` };
  }
}

export async function collectRadarCandidates(days = 7) {
  const cutoff = daysAgoIso(days);
  const results = await Promise.all(radarSources.map(fetchSource));
  const errors = results.map(result => result.error).filter((value): value is string => Boolean(value));
  const seen = new Set<string>();
  const items: RadarCandidate[] = [];

  for (const result of results) {
    for (const item of result.items) {
      const key = item.url.replace(/\/$/, "").toLowerCase();
      if (seen.has(key)) continue;
      if (item.publishedAt) {
        const published = new Date(item.publishedAt);
        if (!Number.isNaN(published.getTime()) && published < cutoff) continue;
      }
      seen.add(key);
      items.push(item);
    }
  }

  items.sort((a, b) => {
    const aTime = a.publishedAt ? Date.parse(a.publishedAt) : 0;
    const bTime = b.publishedAt ? Date.parse(b.publishedAt) : 0;
    return bTime - aTime;
  });

  // Cap prompt size while keeping source diversity.
  const perSource = new Map<string, number>();
  const capped: RadarCandidate[] = [];
  for (const item of items) {
    const count = perSource.get(item.sourceId) ?? 0;
    if (count >= 8) continue;
    perSource.set(item.sourceId, count + 1);
    capped.push(item);
    if (capped.length >= 60) break;
  }

  return { items: capped, errors, sourceCount: radarSources.length };
}
