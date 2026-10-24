import { NextResponse } from "next/server";
import { getGa4Connection } from "@/lib/analytics/ga4";
import { formatReadingDuration, getGa4PostReadingStats, normalizeBlogPostPath } from "@/lib/analytics/post-stats";
import { requireAdmin } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }

  const path = normalizeBlogPostPath(new URL(request.url).searchParams.get("path") ?? "");
  if (!path) {
    return NextResponse.json({ error: "Geçersiz yazı yolu." }, { status: 400, headers: { "Cache-Control": "private, no-store" } });
  }

  if (!getGa4Connection().ready) {
    return NextResponse.json(
      {
        ready: false,
        path,
        readers: null,
        averageDuration: null,
        periodDays: 30,
      },
      { headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } },
    );
  }

  const result = await getGa4PostReadingStats(path, 30);
  if (result.error) {
    return NextResponse.json(
      { ready: true, path, error: result.error, readers: null, averageDuration: null, periodDays: 30 },
      { status: 502, headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } },
    );
  }

  return NextResponse.json(
    {
      ready: true,
      path,
      readers: result.data?.readers ?? 0,
      views: result.data?.views ?? 0,
      averageSeconds: result.data?.averageSeconds ?? null,
      averageDuration: formatReadingDuration(result.data?.averageSeconds ?? null),
      periodDays: result.data?.periodDays ?? 30,
    },
    { headers: { "Cache-Control": "private, no-store", Vary: "Cookie" } },
  );
}
