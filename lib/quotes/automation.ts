import type { SupabaseClient } from "@supabase/supabase-js";
import { quoteAuthors } from "../../data/quote-sources.ts";
import { findAuthorPortrait, type AuthorPortrait } from "./portrait.ts";
import { translateQuote } from "./translation.ts";

export function automaticApprovalEnabled() { return process.env.QUOTE_AUTO_APPROVE !== "false"; }

export async function automateQuoteCandidates(client: SupabaseClient, signal: AbortSignal) {
  const { data, error } = await client.from("quote_candidates").select("*")
    .in("status", ["pending", "approved"]).eq("source_matched", true)
    .order("automation_checked_at", { ascending: true, nullsFirst: true }).limit(50);
  if (error) throw new Error("Söz otomasyonu migration dosyasını uygula (20261024220000_quote_automation.sql).");
  const portraits = new Map<string, AuthorPortrait | null>();
  let translated = 0;
  let approved = 0;
  let photos = 0;
  let attempted = 0;
  for (const row of data ?? []) {
    if (signal.aborted || attempted >= 2) break;
    if (row.automation_checked_at && Date.parse(row.automation_checked_at) > Date.now() - 86_400_000) continue;
    const needsTranslation = row.status === "pending" && !row.translation;
    const needsPortrait = !row.portrait_src;
    if (!needsTranslation && !needsPortrait) continue;
    const author = quoteAuthors.find((item) => item.name === row.author);
    if (!author) continue;
    attempted++;
    const patch: Record<string, unknown> = { automation_checked_at: new Date().toISOString() };
    const notes: string[] = [];
    try {
      if (needsTranslation) {
        // At most two complete translations per run, using only the anonymous free API.
        const text = await translateQuote(row.original, signal);
        patch.translation = text;
        patch.source_note = "Otomatik Türkçe çeviri · MyMemory";
        patch.source_label = row.source_label || row.source_title.slice(0, 150);
        translated++;
        notes.push("Geri çeviri, sayı ve olumsuzluk kontrolleri geçti.");
        if (automaticApprovalEnabled()) {
          patch.status = "approved";
          patch.approved_at = new Date().toISOString();
          patch.auto_approved = true;
        }
      }
    } catch (error) { notes.push(error instanceof Error ? error.message : "Çeviri bekliyor."); }
    if (needsPortrait && !signal.aborted) {
      try {
        if (!portraits.has(author.name)) portraits.set(author.name, await findAuthorPortrait(author.page, signal));
        const portrait = portraits.get(author.name);
        if (portrait) {
          patch.portrait_src = portrait.src;
          patch.portrait_credit = portrait.credit;
          patch.portrait_source_url = portrait.sourceUrl;
          patch.portrait_license_url = portrait.licenseUrl;
          notes.push("Yazar kimliği ve açık fotoğraf lisansı Wikimedia'dan eşleştirildi.");
        } else notes.push("Uygun lisanslı portre bulunamadı; baş harfler kullanılır.");
      } catch { notes.push("Portre kaynağı erişilemiyor; baş harfler kullanılır."); }
    }
    patch.automation_note = notes.join(" ");
    // A concurrent human review wins. Never revive a rejected quote or overwrite
    // a translation/photo that the editor supplied during the network requests.
    let update = client.from("quote_candidates").update(patch).eq("id", row.id).eq("updated_at", row.updated_at);
    if (needsTranslation) update = update.eq("status", "pending").is("translation", null);
    const { data: saved, error: saveError } = await update.select("id");
    if (saveError) throw new Error("Otomatik hazırlama kaydedilemedi.");
    if (saved?.length) {
      if (patch.status === "approved") approved++;
      if (patch.portrait_src) photos++;
    }
  }
  return { translated, approved, photos, attempted };
}
