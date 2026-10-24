import { plainText } from "./discovery.ts";
import { quoteJson } from "./remote.ts";

export type AuthorPortrait = { src: string; credit: string; sourceUrl: string; licenseUrl: string };

function wikiApi(host: string, params: Record<string, string>) {
  const url = new URL(`https://${host}/w/api.php`);
  url.search = new URLSearchParams({ format: "json", formatversion: "2", ...params }).toString();
  return url;
}

export function readCommonsPortrait(info: Record<string, unknown>): AuthorPortrait | null {
  const metadata = info.extmetadata as Record<string, { value?: string }> | undefined;
  const get = (key: string) => plainText(metadata?.[key]?.value ?? "");
  const license = get("LicenseShortName");
  const licenseUrl = get("LicenseUrl");
  const artist = get("Artist");
  const restrictions = get("Restrictions");
  const allowedLicense = /^https?:\/\/creativecommons\.org\/(licenses\/(by|by-sa)\/\d\.\d|publicdomain\/(zero|mark)\/1\.0)\/?$/i.test(licenseUrl)
    || (/^public domain$/i.test(license) && get("Copyrighted") === "False");
  if (!allowedLicense || !artist || artist.length > 155 || restrictions || !license || license.length > 35) return null;
  try {
    const src = new URL(String(info.thumburl ?? info.url));
    const page = new URL(String(info.descriptionurl));
    if (src.protocol !== "https:" || src.hostname !== "upload.wikimedia.org" || src.username || src.password || src.port ||
      page.protocol !== "https:" || page.hostname !== "commons.wikimedia.org" || page.username || page.password || page.port ||
      !["image/jpeg", "image/png", "image/webp"].includes(String(info.mime))) return null;
    return { src: src.toString(), credit: `${artist} · ${license}`, sourceUrl: page.toString(),
      licenseUrl: licenseUrl ? licenseUrl.replace(/^http:/, "https:") : "https://creativecommons.org/publicdomain/mark/1.0/" };
  } catch { return null; }
}

export async function findAuthorPortrait(page: string, signal: AbortSignal): Promise<AuthorPortrait | null> {
  // Exact Wikiquote page -> Wikidata item -> P18. No ambiguous name search.
  const identity = await quoteJson(wikiApi("en.wikiquote.org", { action: "query", titles: page, prop: "pageprops", ppprop: "wikibase_item", redirects: "1" }), signal);
  const id = identity.query?.pages?.[0]?.pageprops?.wikibase_item;
  if (typeof id !== "string" || !/^Q\d+$/.test(id)) return null;
  const entity = await quoteJson(wikiApi("www.wikidata.org", { action: "wbgetentities", ids: id, props: "claims" }), signal);
  const statements = entity.entities?.[id]?.claims?.P18 ?? [];
  const preferred = statements.filter((claim: { rank?: string }) => claim.rank === "preferred");
  const claim = (preferred.length ? preferred : statements.filter((item: { rank?: string }) => item.rank !== "deprecated"))[0];
  const file = claim?.mainsnak?.datavalue?.value;
  if (typeof file !== "string" || file.length > 220) return null;
  const commons = await quoteJson(wikiApi("commons.wikimedia.org", {
    action: "query", titles: `File:${file}`, prop: "imageinfo", iiprop: "url|extmetadata|mime", iiurlwidth: "600",
  }), signal);
  const info = commons.query?.pages?.[0]?.imageinfo?.[0];
  return info ? readCommonsPortrait(info) : null;
}
