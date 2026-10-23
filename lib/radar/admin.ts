import "server-only";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { RadarDigestPayload } from "./gemini";
import { currentWeekStart } from "./week";

export type RadarDigestRow = {
  id: string;
  weekStart: string;
  summary: string;
  items: RadarDigestPayload["items"];
  followUps: RadarDigestPayload["followUps"];
  sourcesUsed: string[];
  model: string | null;
  createdAt: string;
  updatedAt: string;
};

function mapRow(row: Record<string, unknown>): RadarDigestRow {
  return {
    id: String(row.id),
    weekStart: String(row.week_start),
    summary: String(row.summary),
    items: (row.items as RadarDigestPayload["items"]) ?? [],
    followUps: (row.follow_ups as RadarDigestPayload["followUps"]) ?? [],
    sourcesUsed: Array.isArray(row.sources_used) ? row.sources_used.map(String) : [],
    model: row.model == null ? null : String(row.model),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

export async function getLatestRadarDigest() {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: null, error: admin.error, weekStart: currentWeekStart() };

  const weekStart = currentWeekStart();
  const { data, error } = await admin.supabase
    .from("radar_digests")
    .select("id, week_start, summary, items, follow_ups, sources_used, model, created_at, updated_at")
    .eq("week_start", weekStart)
    .maybeSingle();

  if (error) {
    // Table may not exist yet before migration.
    const missing = /radar_digests|schema cache|does not exist/i.test(error.message);
    return {
      data: null,
      error: missing
        ? "Radar tablosu henüz kurulmamış. Supabase migration’ını çalıştır."
        : "Radar brifingi yüklenemedi.",
      weekStart,
    };
  }

  return { data: data ? mapRow(data as Record<string, unknown>) : null, error: null, weekStart };
}

export async function saveRadarDigest(input: {
  weekStart: string;
  digest: RadarDigestPayload;
  sourcesUsed: string[];
  model: string;
}) {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: null, error: admin.error };

  const payload = {
    week_start: input.weekStart,
    summary: input.digest.summary,
    items: input.digest.items,
    follow_ups: input.digest.followUps,
    sources_used: input.sourcesUsed,
    model: input.model,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await admin.supabase
    .from("radar_digests")
    .upsert(payload, { onConflict: "week_start" })
    .select("id, week_start, summary, items, follow_ups, sources_used, model, created_at, updated_at")
    .single();

  if (error || !data) {
    const missing = error && /radar_digests|schema cache|does not exist/i.test(error.message);
    return {
      data: null,
      error: missing
        ? "Radar tablosu henüz kurulmamış. Supabase migration’ını çalıştır."
        : "Radar brifingi kaydedilemedi.",
    };
  }

  return { data: mapRow(data as Record<string, unknown>), error: null };
}
