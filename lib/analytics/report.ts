import { z } from "zod";

export const analyticsPeriods = [7, 30, 90] as const;
export type AnalyticsPeriod = typeof analyticsPeriods[number];

export function analyticsPeriod(value: string | string[] | undefined): AnalyticsPeriod {
  const days = Number(Array.isArray(value) ? value[0] : value);
  return analyticsPeriods.find(period => period === days) ?? 30;
}

const value = z.object({ value: z.string() });
const report = z.object({
  rows: z.array(z.object({ dimensionValues: z.array(value).optional(), metricValues: z.array(value) })).optional(),
  metadata: z.object({ timeZone: z.string().optional(), subjectToThresholding: z.boolean().optional(), dataLossFromOtherRow: z.boolean().optional() }).optional(),
});
const responseSchema = z.object({ reports: z.array(report).length(4) });

export function buildAnalyticsRequests(days: AnalyticsPeriod, host: string) {
  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: "today" }];
  const baseHost = host.replace(/^www\./, "");
  const hostFilter = { filter: { fieldName: "hostName", inListFilter: { values: [baseHost, `www.${baseHost}`], caseSensitive: false } } };
  const publicFilter = { andGroup: { expressions: [hostFilter, { notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/admin" } } } }] } };
  const metric = (name: string) => ({ name });
  return [
    { dateRanges, dimensionFilter: publicFilter, metrics: ["totalUsers", "screenPageViews", "sessions", "engagementRate"].map(metric) },
    { dateRanges, dimensionFilter: publicFilter, dimensions: [{ name: "date" }], metrics: ["screenPageViews", "totalUsers"].map(metric), orderBys: [{ dimension: { dimensionName: "date" } }] },
    { dateRanges, dimensionFilter: { andGroup: { expressions: [hostFilter, { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/blog/" } } }] } }, dimensions: [{ name: "pagePath" }], metrics: ["screenPageViews", "totalUsers"].map(metric), orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: "20" },
    { dateRanges, dimensionFilter: publicFilter, dimensions: [{ name: "sessionDefaultChannelGroup" }], metrics: ["sessions", "totalUsers"].map(metric), orderBys: [{ metric: { metricName: "sessions" }, desc: true }], limit: "10" },
  ];
}

export function parseAnalyticsResponse(value: unknown) {
  const { reports } = responseSchema.parse(value);
  function numberAt(row: NonNullable<typeof reports[number]["rows"]>[number] | undefined, index: number) {
    if (!row) return 0; // GA4 omits rows when a report has no recorded activity.
    const raw = row.metricValues[index]?.value;
    if (raw === undefined || !Number.isFinite(Number(raw)) || Number(raw) < 0) throw new Error("Invalid GA4 metric");
    return Number(raw);
  }
  const summary = reports[0].rows?.[0];
  return {
    users: numberAt(summary, 0), views: numberAt(summary, 1), sessions: numberAt(summary, 2), engagementRate: numberAt(summary, 3),
    daily: (reports[1].rows ?? []).map(row => ({ date: row.dimensionValues?.[0]?.value ?? "", views: numberAt(row, 0), users: numberAt(row, 1) })),
    posts: (reports[2].rows ?? []).map(row => ({ path: row.dimensionValues?.[0]?.value ?? "", views: numberAt(row, 0), users: numberAt(row, 1) })).filter(row => /^\/blog\/[^/?#]+\/?$/.test(row.path)),
    sources: (reports[3].rows ?? []).map(row => ({ name: row.dimensionValues?.[0]?.value || "Belirtilmemiş", sessions: numberAt(row, 0), users: numberAt(row, 1) })),
    timeZone: reports[0].metadata?.timeZone ?? null,
    limited: reports.some(item => item.metadata?.subjectToThresholding || item.metadata?.dataLossFromOtherRow),
  };
}

export type AnalyticsReport = ReturnType<typeof parseAnalyticsResponse>;
