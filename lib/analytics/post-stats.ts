import "server-only";
import { cache } from "react";
import { JWT } from "google-auth-library";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getGa4Connection } from "@/lib/analytics/ga4";
import { getSiteUrl } from "@/lib/site";

export type PostReadingStats = {
  path: string;
  readers: number;
  views: number;
  averageSeconds: number | null;
  periodDays: number;
};

const responseSchema = z.object({
  rows: z
    .array(
      z.object({
        metricValues: z.array(z.object({ value: z.string() })),
      }),
    )
    .optional(),
});

/** Accept only public blog detail paths: /blog/slug */
export function normalizeBlogPostPath(value: string) {
  try {
    const path = value.startsWith("http") ? new URL(value).pathname : value;
    const match = path.trim().match(/^\/blog\/([^/?#]+)\/?$/);
    if (!match?.[1] || match[1] === "undefined") return null;
    return `/blog/${decodeURIComponent(match[1])}`;
  } catch {
    return null;
  }
}

export function formatReadingDuration(seconds: number | null) {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return "—";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function metricNumber(row: z.infer<typeof responseSchema>["rows"], index: number) {
  const raw = row?.[0]?.metricValues[index]?.value;
  if (raw === undefined) return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) throw new Error("Invalid GA4 metric");
  return value;
}

export const getGa4PostReadingStats = cache(
  async (rawPath: string, periodDays = 30): Promise<{ data: PostReadingStats | null; error: string | null }> => {
    const admin = await requireAdmin();
    if (!admin.ok) return { data: null, error: admin.error };

    const path = normalizeBlogPostPath(rawPath);
    if (!path) return { data: null, error: "Geçersiz yazı yolu." };
    if (!getGa4Connection().ready) return { data: null, error: null };

    const days = Math.min(90, Math.max(1, Math.floor(periodDays)));
    const host = new URL(getSiteUrl()).hostname.replace(/^www\./, "");
    const hostFilter = {
      filter: {
        fieldName: "hostName",
        inListFilter: { values: [host, `www.${host}`], caseSensitive: false },
      },
    };
    const pathFilter = {
      filter: {
        fieldName: "pagePath",
        inListFilter: { values: [path, `${path}/`], caseSensitive: false },
      },
    };

    try {
      const auth = new JWT({
        email: process.env.GA4_CLIENT_EMAIL!.trim(),
        key: process.env.GA4_PRIVATE_KEY!.trim().replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
      });
      const propertyId = process.env.GA4_PROPERTY_ID!.trim();
      const response = await auth.request<unknown>({
        url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
        method: "POST",
        data: {
          dateRanges: [{ startDate: `${days - 1}daysAgo`, endDate: "today" }],
          dimensionFilter: { andGroup: { expressions: [hostFilter, pathFilter] } },
          metrics: [
            { name: "activeUsers" },
            { name: "screenPageViews" },
            { name: "userEngagementDuration" },
          ],
        },
        timeout: 10000,
        retry: false,
      });

      const parsed = responseSchema.parse(response.data);
      const readers = metricNumber(parsed.rows, 0);
      const views = metricNumber(parsed.rows, 1);
      const engagementSeconds = metricNumber(parsed.rows, 2);
      const averageSeconds = readers > 0 ? engagementSeconds / readers : null;

      return {
        data: {
          path,
          readers,
          views,
          averageSeconds,
          periodDays: days,
        },
        error: null,
      };
    } catch (error) {
      const status =
        typeof error === "object" && error && "response" in error
          ? (error.response as { status?: number } | undefined)?.status
          : undefined;
      console.error("[GA4 post stats]", {
        status: status ?? null,
        type: error instanceof Error && error.name === "ZodError" ? "invalid-response" : "request-failed",
      });
      const message =
        status === 403
          ? "GA4 erişimi reddedildi."
          : status === 401
            ? "GA4 kimlik doğrulaması başarısız."
            : status === 429
              ? "GA4 sorgu kotası dolu."
              : "Yazı istatistiği alınamadı.";
      return { data: null, error: message };
    }
  },
);
