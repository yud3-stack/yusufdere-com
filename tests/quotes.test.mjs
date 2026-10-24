import { test } from "node:test";
import assert from "node:assert/strict";
import { dailyQuotes, quoteDate, getDailyQuote } from "../data/quotes.ts";

test("daily quote changes at Istanbul midnight, independently of visitor timezone", () => {
  const before = quoteDate(new Date("2026-10-24T20:59:59Z"));
  const after = quoteDate(new Date("2026-10-24T21:00:00Z"));
  assert.equal(before, "2026-10-24");
  assert.equal(after, "2026-10-25");
  assert.notEqual(getDailyQuote(before).id, getDailyQuote(after).id);
  assert.equal(getDailyQuote(before), getDailyQuote(quoteDate(new Date("2026-10-24T04:00:00Z"))));
});

test("rotation remains stable across month/year boundaries and dates before its epoch", () => {
  for (const date of ["2026-01-01", "2026-10-23", "2026-10-31", "2026-12-31", "2027-01-01"]) {
    const next = new Date(`${date}T12:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    assert.ok(dailyQuotes.includes(getDailyQuote(date)));
    assert.notEqual(getDailyQuote(date).id, getDailyQuote(quoteDate(next)).id);
  }
  for (const invalid of ["", "2026-02-30", "2026-13-01", "24/10/2026"]) assert.throws(() => getDailyQuote(invalid));
});

test("all daily entries have primary sources and locally available portrait metadata", () => {
  assert.equal(new Set(dailyQuotes.map((quote) => quote.id)).size, dailyQuotes.length);
  for (const quote of dailyQuotes) {
    assert.ok(quote.text && quote.original && quote.author && quote.sourceLabel && quote.sourceNote);
    assert.equal(new URL(quote.sourceUrl).hostname, "www.cs.utexas.edu");
    assert.ok(quote.portraitCredit && quote.portraitSrc.startsWith("/images/quotes/"));
  }
});

test("mobile locale date ordering cannot change the ISO quote key", async () => {
  const original = Intl.DateTimeFormat;
  try {
    Intl.DateTimeFormat = class {
      format() { return "10/25/2026"; }
      formatToParts() {
        return [{ type: "month", value: "10" }, { type: "literal", value: "/" },
          { type: "day", value: "25" }, { type: "literal", value: "/" }, { type: "year", value: "2026" }];
      }
    };
    const mobile = await import("../data/quotes.ts?mobile-date-order");
    assert.equal(mobile.quoteDate(new Date()), "2026-10-25");
    assert.doesNotThrow(() => mobile.getDailyQuote(mobile.quoteDate(new Date())));
  } finally { Intl.DateTimeFormat = original; }
});
