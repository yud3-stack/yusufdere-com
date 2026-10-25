import { test } from "node:test";
import assert from "node:assert/strict";
import { extractSourcedQuotes, safeSourceUrl, sourceContainsQuote, quoteFingerprint, discoverQuotes, selectDiscoveryAuthors, discoveryAuthorPlan } from "../lib/quotes/discovery.ts";

const original = "A software program should make its intent clear to every reader.";
const source = "https://www.cs.utexas.edu/~EWD/transcriptions/EWD03xx/EWD340.html";

test("only sourced, relevant top-level quotations survive; disputed sections and their subsections stay excluded", () => {
  const text = `== Quotes ==\n* ${original}\n** Lecture [${source} source]\n* A wonderful day in the garden is a wonderful day indeed.\n** [${source} source]\n* Software without a citation must never be imported here.\n== Misattributed ==\n=== Computing ===\n* A disputed software quote is not a publishing candidate.\n** [${source} source]\n=== Another subsection ===\n* Another disputed software quote must also be excluded.\n** [${source} source]\n== Quotes ==\n* A second software quotation comes with a primary citation.\n** [${source} source]`;
  const result = extractSourcedQuotes(text);
  assert.equal(result.length, 2);
  assert.equal(result[0].original, original);
  assert.ok(result.every((item) => item.sourceUrl === source));
});

test("network checks reject arbitrary hosts, credentials, ports and unsafe schemes", () => {
  for (const url of ["http://127.0.0.1/admin", "https://localhost/", "https://www.cs.utexas.edu.evil.example/", "https://user:pass@www.cs.utexas.edu/", "https://www.cs.utexas.edu:8080/", "file:///etc/passwd", "javascript:alert(1)"]) assert.equal(safeSourceUrl(url), null);
  assert.equal(safeSourceUrl("http://www.cs.utexas.edu/users/EWD/ewd02xx/EWD249.PDF"), "https://www.cs.utexas.edu/~EWD/transcriptions/EWD02xx/EWD249.html");
  assert.equal(
    safeSourceUrl("http://web.archive.org/web/20091128074415/http://www2.research.att.com/~bs/notes.pdf"),
    "https://www2.research.att.com/~bs/notes.pdf",
  );
  assert.equal(safeSourceUrl("http://web.archive.org/web/2000/http://evil.example/x"), null);
});

test("topical filter keeps language/C++ quotes with allowlisted sources", () => {
  const text = `== Quotes ==\n* Within C++, there is a much smaller and cleaner language struggling to get out.\n** [https://www.stroustrup.com/quotes.html Quotes]\n* C is quirky, flawed, and an enormous success.\n** [https://www.bell-labs.com/usr/dmr/www/chist.html History]`;
  const result = extractSourcedQuotes(text);
  assert.equal(result.length, 2);
  assert.equal(result[0].sourceUrl, "https://www.stroustrup.com/quotes.html");
});

test("verification matches full text despite markup and punctuation, not merely HTTP success", () => {
  assert.equal(sourceContainsQuote(`<p>A <strong>software program</strong> should make its intent clear to every reader.</p>`, original), true);
  assert.equal(sourceContainsQuote("Page temporarily unavailable. Software program archive.", original), false);
  assert.equal(sourceContainsQuote("Hello", "Hello"), false);
  assert.equal(quoteFingerprint("Author", original), quoteFingerprint("AUTHOR", original.toUpperCase()));
});

test("collector deduplicates known/rejected records and does not follow redirects to private hosts", async () => {
  const previous = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).startsWith("https://en.wikiquote.org/w/api.php")) return Response.json({ parse: { revid: 123, wikitext: `== Quotes ==\n* ${original}\n** [${source} source]` } });
    return new Response(null, { status: 302, headers: { location: "http://127.0.0.1/secret" } });
  };
  try {
    const result = await discoverQuotes("2026-10-24", new Set([quoteFingerprint("Edsger W. Dijkstra", original)]));
    assert.equal(result.candidates.length, 0);
    assert.ok(calls.every((url) => !url.includes("127.0.0.1")));
    // One live attempt; the same dead source URL is not re-fetched for every author.
    assert.equal(result.checks, 1);
    assert.ok(result.stats.unavailable >= 1);
  } finally { globalThis.fetch = previous; }
});

test("collector records exact source revision and never emits an approved translation", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async (url) => String(url).startsWith("https://en.wikiquote.org/w/api.php")
    ? Response.json({ parse: { revid: 456, wikitext: `== Quotes ==\n* ${original}\n** [${source} source]` } })
    : new Response(`<p>${original}</p>`);
  try {
    const result = await discoverQuotes("2026-10-24");
    assert.equal(result.candidates.length, 4);
    assert.ok(result.candidates.every((item) => item.discovery_url.endsWith("oldid=456") && item.source_matched));
    assert.ok(result.candidates.every((item) => !("translation" in item) && !("status" in item)));
  } finally { globalThis.fetch = previous; }
});

test("failed source checks resume beyond the same first entries on the next run", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async (raw) => {
    const url = new URL(raw);
    if (url.hostname === "en.wikiquote.org") {
      if (url.searchParams.get("page") !== "Edsger W. Dijkstra") return Response.json({ parse: { revid: 1, wikitext: "== Quotes ==" } });
      return Response.json({ parse: { revid: 1, wikitext: "== Quotes ==\n" + Array.from({length:12}, (_,i) => `* A software program number ${i} should be clear to its reader.\n** [${source}?item=${i} Source]`).join("\n") } });
    }
    return new Response("Temporarily unavailable", { status: 503 });
  };
  try {
    const first = await discoverQuotes("2026-10-24");
    assert.equal(first.checks, 8);
    assert.equal(first.cursors["Edsger W. Dijkstra"], 8);
    const second = await discoverQuotes("2026-10-24", new Set(), undefined, { cursors: first.cursors });
    assert.equal(second.cursors["Edsger W. Dijkstra"], 4);
    assert.equal(second.candidates.length, 0);
  } finally { globalThis.fetch = previous; }
});

test("underrepresented writers get priority while a rotating slot keeps productive writers reachable", () => {
  const counts = { "Edsger W. Dijkstra": 20 };
  const first = selectDiscoveryAuthors({ authorCounts: counts });
  assert.ok(first.some((author) => author.name === "Paul Graham"));
  assert.equal(first[0].name, "Donald Knuth");
  const seen = new Set();
  for(let authorOffset=0;authorOffset<10;authorOffset++)
    for(const author of selectDiscoveryAuthors({ authorCounts: counts, authorOffset })) seen.add(author.name);
  assert.equal(seen.size, 10);
  const plan = discoveryAuthorPlan({ authorCounts: counts, authorOffset: 6 });
  assert.equal(plan.length, 10);
  assert.ok(plan.slice(4).some((author) => author.name === "Edsger W. Dijkstra"));
});

test("barren primary authors do not stop the run; catalog fallback still finds sourced quotes", async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = async (raw) => {
    const url = new URL(raw);
    if (url.hostname === "en.wikiquote.org") {
      const page = url.searchParams.get("page");
      if (page === "Edsger W. Dijkstra") {
        return Response.json({ parse: { revid: 9, wikitext: `== Quotes ==\n* ${original}\n** [${source} source]` } });
      }
      return Response.json({ parse: { revid: 1, wikitext: "== Quotes ==\n* A lovely garden needs no citation at all." } });
    }
    return new Response(`<p>${original}</p>`);
  };
  try {
    // Offset 6 → Fowler/Pike/Stroustrup/Ritchie-like barren primary batch in the catalog order.
    const result = await discoverQuotes("2026-10-25", new Set(), undefined, {
      authorOffset: 6,
      authorCounts: { "Edsger W. Dijkstra": 20 },
    });
    assert.ok(result.candidates.length >= 1);
    assert.ok(result.stats.authors.includes("Edsger W. Dijkstra"));
    assert.ok(result.stats.authors.length > 4);
  } finally {
    globalThis.fetch = previous;
  }
});
