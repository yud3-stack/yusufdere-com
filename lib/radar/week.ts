/** ISO week Monday (Europe/Istanbul calendar day) as YYYY-MM-DD. */
export function currentWeekStart(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Istanbul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const year = Number(parts.find(part => part.type === "year")?.value);
  const month = Number(parts.find(part => part.type === "month")?.value);
  const day = Number(parts.find(part => part.type === "day")?.value);
  // Noon UTC avoids DST edge cases when shifting to Monday.
  const local = new Date(Date.UTC(year, month - 1, day, 12));
  const weekday = local.getUTCDay(); // 0 Sun … 6 Sat
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1;
  local.setUTCDate(local.getUTCDate() - daysFromMonday);
  return local.toISOString().slice(0, 10);
}

export function daysAgoIso(days: number, now = new Date()): Date {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}
