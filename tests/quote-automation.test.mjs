import { test } from "node:test";
import assert from "node:assert/strict";
import { readCommonsPortrait, findAuthorPortrait } from "../lib/quotes/portrait.ts";
import { translationPasses, translateQuote } from "../lib/quotes/translation.ts";
import { automateQuoteCandidates } from "../lib/quotes/automation.ts";

const photo = {
  thumburl: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Portrait.jpg", mime: "image/jpeg",
  descriptionurl: "https://commons.wikimedia.org/wiki/File:Portrait.jpg",
  extmetadata: { Artist: { value: '<a href="https://example.org">Example Photographer</a>' },
    LicenseShortName: { value: "CC BY-SA 4.0" }, LicenseUrl: { value: "https://creativecommons.org/licenses/by-sa/4.0/" } },
};
const en = "Simple software programs are easier to understand and maintain.";
const tr = "Basit yazılım programlarını anlamak ve sürdürmek daha kolaydır.";

test("Commons image requires explicit reusable license, credit, image format and trusted URL", () => {
  const accepted = readCommonsPortrait(photo);
  assert.equal(accepted.credit, "Example Photographer · CC BY-SA 4.0");
  assert.equal(readCommonsPortrait({ ...photo, extmetadata: {} }), null);
  assert.equal(readCommonsPortrait({ ...photo, mime: "image/svg+xml" }), null);
  assert.equal(readCommonsPortrait({ ...photo, thumburl: "https://example.org/photo.jpg" }), null);
  assert.equal(readCommonsPortrait({ ...photo, extmetadata: { ...photo.extmetadata, Restrictions: { value: "permission required" } } }), null);
  assert.equal(readCommonsPortrait({ ...photo, extmetadata: { ...photo.extmetadata, LicenseUrl: { value: "https://creativecommons.org/licenses/by-nc/4.0/" } } }), null);
});

test("translation gate rejects unchanged text, number/negation loss and unrelated back-translations", () => {
  assert.equal(translationPasses(en, tr, en), true);
  assert.equal(translationPasses(en, en, en), false);
  assert.equal(translationPasses("Never hide 2 software errors.", "İki yazılım hatasını gizle.", "Hide software errors."), false);
  assert.equal(translationPasses("Never hide software errors.", "Yazılım hatalarını asla gizleme.", "Hide software errors."), false);
  assert.equal(translationPasses(en, tr, "The weather is lovely today."), false);
});

test("portrait lookup follows exact Wikiquote identity and preferred Wikidata photo, never name search", async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (raw) => {
    const url = new URL(raw); calls.push(url);
    if (url.hostname === "en.wikiquote.org") return Response.json({ query: { pages: [{ pageprops: { wikibase_item: "Q123" } }] } });
    if (url.hostname === "www.wikidata.org") return Response.json({ entities: { Q123: { claims: { P18: [{ rank: "preferred", mainsnak: { datavalue: { value: "Portrait.jpg" } } }] } } } });
    return Response.json({ query: { pages: [{ imageinfo: [photo] }] } });
  };
  try {
    const result = await findAuthorPortrait("Donald Knuth", AbortSignal.timeout(1000));
    assert.ok(result);
    assert.equal(calls.length, 3);
    assert.ok(calls.every((url) => !url.searchParams.has("search")));
    assert.equal(calls[1].searchParams.get("ids"), "Q123");
  } finally { globalThis.fetch = previous; }
});

test("free translation quota response is never treated as publishable text", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ responseStatus: 403, quotaFinished: true, responseData: { translatedText: "YOU USED ALL AVAILABLE FREE TRANSLATIONS" } });
  try { await assert.rejects(() => translateQuote(en, AbortSignal.timeout(1000)), /kota/); }
  finally { globalThis.fetch = previous; }
});

test("automation publishes only source-matched queued rows and uses an optimistic version check", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async (raw) => Response.json({ responseStatus: 200, responseData: { translatedText: new URL(raw).searchParams.get("langpair") === "en|tr" ? tr : en } });
  const patches = [];
  const filters = [];
  const row = { id: "a".repeat(64), author: "Edsger W. Dijkstra", original: en, status: "pending", translation: null,
    portrait_src: "/images/quotes/edsger-dijkstra.jpg", source_title: "Source", updated_at: "2026-10-24T00:00:00Z" };
  const client = { from() { return {
    select() { return this; }, in(key, value) { filters.push([key, value]); return this; },
    eq(key, value) { filters.push([key, value]); return this; }, order() { return this; },
    async limit() { return { data: [row], error: null }; },
    update(patch) { patches.push(patch); return {
      eq(key, value) { filters.push([key, value]); return this; }, is(key, value) { filters.push([key, value]); return this; },
      async select() { return { data: [{ id: row.id }], error: null }; },
    }; },
  }; } };
  try {
    const result = await automateQuoteCandidates(client, AbortSignal.timeout(1000));
    assert.equal(result.approved, 1);
    assert.equal(patches[0].translation, tr);
    assert.equal(patches[0].auto_approved, true);
    assert.match(patches[0].source_note, /Otomatik/);
    assert.ok(filters.some(([key, value]) => key === "source_matched" && value === true));
    assert.ok(filters.some(([key, value]) => key === "updated_at" && value === row.updated_at));
    assert.ok(filters.some(([key, value]) => key === "translation" && value === null));
  } finally { globalThis.fetch = previous; }
});
