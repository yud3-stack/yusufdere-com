import { test } from "node:test";
import assert from "node:assert/strict";
import { analyticsPeriod, buildAnalyticsRequests, parseAnalyticsResponse } from "../lib/analytics/report.ts";

test("period is allowlisted and includes today without an extra day", () => {
  assert.equal(analyticsPeriod("7"), 7);
  assert.equal(analyticsPeriod("999999"), 30);
  assert.equal(analyticsPeriod(["90"]), 90);
  assert.equal(buildAnalyticsRequests(7, "yusufdere.com")[0].dateRanges[0].startDate, "6daysAgo");
});

test("every query is site-scoped; public reports exclude admin and post reports exclude archive", () => {
  const queries = buildAnalyticsRequests(30, "yusufdere.com");
  for (const query of queries) assert.match(JSON.stringify(query.dimensionFilter), /yusufdere\.com/);
  for (const index of [0,1,3]) assert.match(JSON.stringify(queries[index].dimensionFilter), /notExpression.*\/admin/);
  assert.match(JSON.stringify(queries[2].dimensionFilter), /\/blog\//);
});

test("bare and www production hosts are included without admitting preview or localhost traffic", () => {
  for (const host of ["yusufdere.com", "www.yusufdere.com"]) {
    const requests = buildAnalyticsRequests(30, host);
    for (const request of requests) {
      const hostFilter = request.dimensionFilter.andGroup.expressions[0].filter;
      assert.deepEqual(hostFilter.inListFilter.values, ["yusufdere.com", "www.yusufdere.com"]);
      assert.equal(hostFilter.fieldName, "hostName");
    }
  }
});

test("period users come from aggregate rather than a sum of repeated daily users", () => {
  const metrics = (...values) => values.map(value => ({value:String(value)}));
  const parsed = parseAnalyticsResponse({ reports: [
    { rows: [{metricValues:metrics(1,6,2,.5)}] },
    { rows: [{dimensionValues:[{value:"20261020"}],metricValues:metrics(3,1)},{dimensionValues:[{value:"20261021"}],metricValues:metrics(3,1)}] },
    { rows: [{dimensionValues:[{value:"//external.example"}],metricValues:metrics(2,1)},{dimensionValues:[{value:"/blog/test"}],metricValues:metrics(4,1)}] },
    { rows: [] },
  ] });
  assert.equal(parsed.users, 1);
  assert.equal(parsed.daily.reduce((sum, day) => sum+day.users,0), 2);
  assert.deepEqual(parsed.posts.map(post=>post.path), ["/blog/test"]);
});

test("successful empty reports are zero; malformed responses fail instead of becoming zero", () => {
  assert.equal(parseAnalyticsResponse({reports:[{},{},{},{}]}).views, 0);
  assert.throws(()=>parseAnalyticsResponse({reports:[]}));
  assert.throws(()=>parseAnalyticsResponse({reports:[{rows:[{metricValues:[{value:"invalid"}]}]},{},{},{}]}));
});
