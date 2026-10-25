"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { collectQuoteCandidates } from "./store";

export type QuoteActionState = { ok: boolean; message: string };
const reviewSchema = z.object({
  translation: z.string().trim().min(10).max(320),
  sourceLabel: z.string().trim().min(3).max(150),
  sourceNote: z.string().trim().min(3).max(120),
  portraitSrc: z.string().trim().max(500).refine((value) => !value || /^\/images\/quotes\/[\w.-]+$/.test(value) || /^https:\/\/upload\.wikimedia\.org\/wikipedia\//.test(value)),
  portraitCredit: z.string().trim().max(200),
}).refine((value) => !value.portraitSrc || value.portraitCredit.length > 3);

export async function collectQuotesAction(_previous: QuoteActionState, _form: FormData): Promise<QuoteActionState> {
  void _previous; void _form;
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, message: admin.error };
  try {
    const result = await collectQuoteCandidates(admin.supabase);
    revalidatePath("/admin/quotes");
    const emptyHint =
      result.found === 0
        ? result.known > 0
          ? " Bilinen sözler atlandı; sonraki tıklamada tarama ilerlemeye devam eder."
          : result.eligible === 0
            ? " Bu turda izinli kaynaklı söz çıkmadı; katalogdaki diğer yazarlara geçildi / geçilecek."
            : " Kaynaklar yanıt vermediyse tekrar dene; tarama kaldığı yerden devam eder."
        : "";
    return {
      ok: true,
      message:
        `${result.authors.length} yazar tarandı. ${result.found} yeni söz bulundu; ` +
        `${result.translated} çeviri, ${result.photos} fotoğraf hazırlandı, ` +
        `${result.approved} söz otomatik havuza alındı. ${result.pending} söz çeviri / inceleme bekliyor. ` +
        `${result.unavailable} kaynak erişilemedi, ${result.unmatched} metin eşleşmedi.` +
        `${emptyHint} ${result.warnings.join(" ")}`.trim(),
    };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Toplama yapılamadı." };
  }
}

export async function reviewQuoteAction(id: string, _previous: QuoteActionState, form: FormData): Promise<QuoteActionState> {
  const admin = await requireAdmin();
  if (!admin.ok) return { ok: false, message: admin.error };
  if (!/^[a-f0-9]{64}$/.test(id)) return { ok: false, message: "Geçersiz kayıt." };
  const decision = form.get("decision");
  if (decision === "reject") {
    const { data, error } = await admin.supabase.from("quote_candidates").update({ status: "rejected", approved_at: null, auto_approved: false }).eq("id", id).select("id").single();
    if (error || !data) return { ok: false, message: "Kayıt reddedilemedi." };
    revalidatePath("/admin/quotes");
    return { ok: true, message: "Reddedildi. Gelecek yayınlara seçilmeyecek." };
  }
  if (decision !== "approve" || form.get("reviewed") !== "yes")
    return { ok: false, message: "Kaynağı, çeviriyi ve varsa fotoğraf kullanım bilgisini kontrol ettiğini işaretle." };
  const input = reviewSchema.safeParse(Object.fromEntries(form));
  if (!input.success) return { ok: false, message: "Çeviri (10–320 karakter), kaynak adı ve fotoğraf kredisini kontrol et. Portre boş, yerel bir söz görseli veya Wikimedia görseli olabilir." };
  const value = input.data;
  const { data: current } = await admin.supabase.from("quote_candidates").select("portrait_src").eq("id", id).single();
  if (!current) return { ok: false, message: "Kayıt bulunamadı." };
  const { data, error } = await admin.supabase.from("quote_candidates").update({
    translation: value.translation, source_label: value.sourceLabel, source_note: value.sourceNote,
    portrait_src: value.portraitSrc, portrait_credit: value.portraitCredit,
    status: "approved", approved_at: new Date().toISOString(),
    auto_approved: false,
    automation_note: "Yönetici tarafından düzenlendi.",
    ...(current.portrait_src !== value.portraitSrc ? { portrait_source_url: null, portrait_license_url: null } : {}),
  }).eq("id", id).eq("source_matched", true).select("id").single();
  if (error || !data) return { ok: false, message: "Onay kaydedilemedi. Kaynak metin eşleşmesi gerekli." };
  revalidatePath("/admin/quotes");
  return { ok: true, message: "Onaylandı. Sonraki günlük seçimlere katılacak; bugünkü yayın değişmez." };
}
