import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as metrics from "../lib/instagram/metrics.ts";

// Exercise the real server module with a fake Meta transport; no credentials or network.
const compiled = ts.transpileModule(readFileSync(new URL("../lib/instagram/report.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

class ApiError extends Error {
  constructor(message, status, code) { super(message); this.status = status; this.code = code; }
}

function reportModule(get, authorized = true) {
  const exports = {};
  runInNewContext(compiled, {
    exports, console: { error() {} },
    require(name) {
      if (name === "server-only") return {};
      if (name === "react") return { cache: fn => fn };
      if (name === "./metrics") return metrics;
      if (name.includes("require-admin")) return { requireAdmin: async () => ({ ok: authorized, error: "Unauthorized" }) };
      if (name === "./client") return { getInstagramToken: () => "fixture-token", InstagramApiError: ApiError, instagramGet: get };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return exports;
}

const profile = { id: "account", username: "fixture", followers_count: 5 };
const media = { id: "photo", media_type: "IMAGE", media_url: "https://example.test/photo.jpg", like_count: 3, comments_count: 0 };

test("insights preserve total_value, including real zero", () => {
  assert.equal(metrics.insightValue([{ name: "reach", total_value: { value: 123 } }], "reach"), 123);
  assert.equal(metrics.insightValue([{ name: "reach", total_value: { value: 0 } }], "reach"), 0);
  assert.equal(metrics.insightValue([], "reach"), null);
});

test("daily series selects the requested day regardless of row order", () => {
  const window = metrics.previousDayWindow(new Date("2026-10-23T13:00:00Z"));
  const values = [{ value: 7, end_time: "2026-10-22T00:00:00Z" }, { value: 11, end_time: "2026-10-23T00:00:00Z" }];
  for (const series of [values, [...values].reverse()]) {
    assert.equal(metrics.insightValue([{ name: "reach", values: series }], "reach", window), 11);
  }
  assert.equal(window.until - window.since, 86400);
  assert.equal(metrics.insightValue([{ name: "reach", values: [{ value: 9 }] }], "reach", window), null);
});

test("incomplete totals stay unknown; known zero and empty collections remain zero", () => {
  assert.equal(metrics.completeTotal([3, null]), null);
  assert.equal(metrics.completeTotal([0, 0]), 0);
  assert.equal(metrics.completeTotal([]), 0);
  assert.equal(metrics.formatCount(null), "—");
  assert.equal(metrics.formatCount(0), "0");
});

test("photo covers work without using video files as images", () => {
  assert.equal(metrics.mediaThumbnail(media), media.media_url);
  assert.equal(metrics.mediaThumbnail({ media_type: "VIDEO", media_url: "video.mp4" }), null);
  assert.equal(metrics.mediaThumbnail({ media_type: "VIDEO", thumbnail_url: "thumb.jpg" }), "thumb.jpg");
});

test("overview never requests Insights and requests real photo URLs", async () => {
  const paths = [];
  const api = reportModule(async (path, params) => {
    paths.push(path);
    if (path === "me") return profile;
    assert.equal(path, "me/media");
    assert.match(params.fields, /(?:^|,)media_url(?:,|$)/);
    return { data: [media] };
  });
  const result = await api.getInstagramOverview();
  assert.deepEqual(paths, ["me", "me/media"]);
  assert.equal(result.data.recentTotals.likes, 3);
  assert.equal(result.data.media[0].thumbnailUrl, media.media_url);
});

test("Insights timeouts preserve profile, media and totals without repeated retries", async () => {
  const paths = [];
  const api = reportModule(async path => {
    paths.push(path);
    if (path === "me") return profile;
    if (path === "me/media") return { data: [media] };
    throw new Error("timeout");
  });
  const result = await api.getInstagramReport();
  assert.equal(result.error, null);
  assert.equal(result.data.profile.followersCount, 5);
  assert.equal(result.data.media.length, 1);
  assert.equal(result.data.recentTotals.likes, 3);
  assert.equal(result.data.insights.available, false);
  assert.ok(result.data.warnings.length);
  assert.equal(paths.filter(path => path === "photo/insights").length, 1);
});

test("unsupported optional account metric does not discard successful metrics", async () => {
  const api = reportModule(async (path, params) => {
    if (path === "me") return profile;
    if (path === "me/media") return { data: [] };
    assert.equal(params.period, "day");
    assert.equal(params.metric_type, "total_value");
    assert.equal(params.until - params.since, 86400);
    if (params.metric === "profile_views") throw new ApiError("Invalid metric", 400, 100);
    return { data: [{ name: params.metric, total_value: { value: 123 } }] };
  });
  const result = await api.getInstagramReport();
  assert.equal(result.data.insights.reach, 123);
  assert.equal(result.data.insights.profileViews, null);
  assert.equal(result.data.insights.available, true);
});

test("media failure preserves profile without reporting zero interactions", async () => {
  const api = reportModule(async path => {
    if (path === "me") return profile;
    throw new Error("offline");
  });
  const result = await api.getInstagramReport();
  assert.equal(result.data.profile.id, "account");
  assert.equal(result.data.recentTotals.likes, null);
  assert.ok(result.data.warnings.length);
});

test("permission errors stop media metric fallback attempts", async () => {
  let requests = 0;
  const api = reportModule(async path => {
    if (path === "me") return profile;
    if (path === "me/media") return { data: [media] };
    if (path === "photo/insights") requests++;
    throw new ApiError("permission", 403, 10);
  });
  await api.getInstagramReport();
  assert.equal(requests, 1);
});

test("authorization fails before any Meta request", async () => {
  let requests = 0;
  const api = reportModule(async () => { requests++; return {}; }, false);
  const result = await api.getInstagramReport();
  assert.equal(requests, 0);
  assert.equal(result.data, null);
});
