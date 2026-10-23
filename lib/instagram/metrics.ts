export type InsightRow = {
  name?: string;
  total_value?: { value?: unknown };
  values?: Array<{ value?: unknown; end_time?: string }>;
};

export type InsightWindow = { since: number; until: number };

export function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}

export function previousDayWindow(now = new Date()): InsightWindow {
  const until = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000;
  return { since: until - 86400, until };
}

export function insightValue(rows: InsightRow[] | undefined, name: string, window?: InsightWindow): number | null {
  const row = rows?.find(item => item.name === name);
  const total = asNumber(row?.total_value?.value);
  if (total !== null) return total;
  const values = row?.values ?? [];
  if (!window) {
    if (values.length === 1) return asNumber(values[0].value);
    return null;
  }
  // A daily sample ends at the exclusive upper boundary of its reporting day.
  const sample = values.find(item => item.end_time && Date.parse(item.end_time) === window.until * 1000);
  return asNumber(sample?.value);
}

export function completeTotal(values: Array<number | null>): number | null {
  return values.some(value => value === null) ? null : values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}

export function mediaThumbnail(raw: Record<string, unknown>): string | null {
  if (typeof raw.thumbnail_url === "string" && raw.thumbnail_url.trim()) return raw.thumbnail_url;
  if (raw.media_type !== "VIDEO" && typeof raw.media_url === "string" && raw.media_url.trim()) return raw.media_url;
  return null;
}

export function formatCount(value: number | null | undefined): string {
  return value == null ? "—" : value.toLocaleString("tr-TR");
}
