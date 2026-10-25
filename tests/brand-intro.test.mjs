import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { brandIntroBootstrap } from "../lib/brand-intro-bootstrap.ts";

function boot({ path = "/", seen = false, reduced = false, blocked = false } = {}) {
  const attributes = new Map();
  const timers = [];
  vm.runInNewContext(brandIntroBootstrap, {
    document: { documentElement: { setAttribute: (key, value) => attributes.set(key, value) } },
    location: { pathname: path }, matchMedia: () => ({ matches: reduced }),
    sessionStorage: { getItem: () => { if (blocked) throw new Error("Storage denied"); return seen ? "1" : null; }, setItem: () => {} },
    Date, setTimeout: callback => timers.push(callback),
  });
  return { attributes, timers };
}
test("first document enables intro synchronously before React runs, with a bounded fallback", () => {
  const { attributes, timers } = boot();
  assert.equal(attributes.get("data-brand-intro"), "playing");
  assert.ok(Number(attributes.get("data-brand-intro-start")) > 0);
  timers[0]();
  assert.equal(attributes.get("data-brand-intro"), "done");
});
test("repeated visits, admin pages, reduced motion and denied storage cannot block content", () => {
  for (const options of [{ seen: true }, { path: "/admin" }, { path: "/admin/quotes" }, { reduced: true }, { blocked: true }]) {
    const { attributes, timers } = boot(options);
    assert.equal(attributes.has("data-brand-intro"), false);
    assert.equal(timers.length, 0);
  }
});
