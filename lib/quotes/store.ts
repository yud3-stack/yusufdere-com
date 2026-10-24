import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicEnv } from "@/lib/supabase/env";
import { getDailyQuote, quoteDate, type DailyQuote } from "@/data/quotes";
import { discoverQuotes } from "./discovery";
import { automateQuoteCandidates } from "./automation";
import { unstable_cache } from "next/cache";

export type QuoteReviewRow = {
  id: string; original: string; translation: string | null; author: string; author_detail: string;
  source_url: string; source_title: string; source_label: string; source_note: string;
  discovery_url: string | null; source_matched: boolean; portrait_src: string; portrait_credit: string;
  status: "pending" | "approved" | "rejected"; created_at: string;
  portrait_source_url: string | null; portrait_license_url: string | null;
  auto_approved: boolean; automation_note: string | null;
};
export const quoteSetupMessage = "Günün sözü tabloları kurulmamış. 20261024210000_daily_quotes.sql migration dosyasını Supabase SQL Editor'da çalıştır.";

export function createQuoteJobClient() {
  const env = getSupabasePublicEnv();
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!env || !key) return null;
  return createClient(env.url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function collectQuoteCandidates(client: SupabaseClient) {
  const deadline = AbortSignal.timeout(50_000);
  const { data: known, error } = await client.from("quote_candidates").select("id,author,status");
  if (error) throw new Error(quoteSetupMessage);
  const { data: progress, error: progressError } = await client.from("quote_discovery_progress").select("author,next_index");
  if (progressError) throw new Error("Tarama ilerleme migration dosyasını uygula (20261024230000_quote_discovery_progress.sql).");
  const cursors = Object.fromEntries((progress ?? []).map((row) => [row.author, row.next_index]));
  const authorCounts: Record<string, number> = {};
  for (const row of known ?? []) authorCounts[row.author] = (authorCounts[row.author] ?? 0) + 1;
  const result = await discoverQuotes(quoteDate(), new Set((known ?? []).map((row) => String(row.id))), deadline,
    { cursors, authorOffset: cursors.__catalog__ ?? 0, authorCounts });
  let inserted = 0;
  if (result.candidates.length) {
    const { data, error: saveError } = await client.from("quote_candidates").upsert(result.candidates, { onConflict: "id", ignoreDuplicates: true }).select("id");
    if (saveError) throw new Error("Bulunan sözler kaydedilemedi.");
    inserted = data?.length ?? 0;
  }
  const automation = await automateQuoteCandidates(client, deadline);
  const { count: pending } = await client.from("quote_candidates").select("id", { count: "exact", head: true }).eq("status", "pending");
  const summary = { found: inserted, warnings: result.warnings, checks: result.checks, ...automation, pending: pending ?? 0, ...result.stats };
  const checkpoints = Object.entries(result.cursors).filter(([author]) => author !== "__catalog__").map(([author, next_index]) => ({ author, next_index, details: {} }));
  const { error: checkpointError } = await client.from("quote_discovery_progress").upsert([
    ...checkpoints, { author: "__catalog__", next_index: result.authorOffset, details: summary },
  ], { onConflict: "author" });
  if (checkpointError) throw new Error("Sözler kaydedildi ancak tarama ilerlemesi kaydedilemedi.");
  return summary;
}

const publishedQuote = unstable_cache(async (date: string) => {
    const env = getSupabasePublicEnv();
    if (!env) throw new Error("Supabase bağlantısı yok.");
    const client = createClient(env.url, env.key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store",
        signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000) }) },
    });
    const { data, error } = await client.rpc("current_daily_quote");
    if (error || !data?.quote || data.date !== date) throw new Error("Günlük yayın erişilemiyor.");
    return { date: data.date as string, quote: data.quote as DailyQuote, fallback: false };
}, ["daily-quote-publication-v2"], { revalidate: 300 });

export async function todayQuote(): Promise<{ date: string; quote: DailyQuote; fallback: boolean }> {
  try {
    // Date is part of the cache key: midnight never serves yesterday's quote.
    // Only successful DB snapshots are cached; unavailable fallbacks are not.
    return await publishedQuote(quoteDate());
  } catch { /* An unavailable DB must not remove the homepage quote. */ }
  const date = quoteDate();
  return { date, quote: getDailyQuote(date), fallback: true };
}
