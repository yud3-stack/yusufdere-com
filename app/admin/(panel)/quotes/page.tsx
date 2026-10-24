import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { quoteSetupMessage, type QuoteReviewRow } from "@/lib/quotes/store";
import { QuoteCollectButton, QuoteReview } from "@/components/admin/QuoteReview";
import { automaticApprovalEnabled } from "@/lib/quotes/automation";

export const metadata = { title: "Günün sözü", robots: { index: false, follow: false } };

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const admin = await requireAdmin();
  if (!admin.ok) return <p>Bu işlem için yetkin yok.</p>;
  const { status: selected } = await searchParams;
  const status = ["pending", "approved", "rejected"].includes(selected ?? "") ? selected! : "pending";
  const { data, error } = await admin.supabase.from("quote_candidates").select("*").eq("status", status).order("created_at", { ascending: false }).limit(100);
  const { data: today } = await admin.supabase.rpc("current_daily_quote");
  const { data: lastRun } = await admin.supabase.from("quote_discovery_progress").select("details,updated_at").eq("author", "__catalog__").maybeSingle();
  const [ready, waiting, rejected] = await Promise.all([
    admin.supabase.from("quote_candidates").select("id", { count: "exact", head: true }).eq("status", "approved"),
    admin.supabase.from("quote_candidates").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.supabase.from("quote_candidates").select("id", { count: "exact", head: true }).eq("status", "rejected"),
  ]);
  return <section className="admin-list-page">
    <h1 className="text-3xl font-semibold tracking-tight">Günün sözü</h1>
    <p className="mt-3 text-sm text-[#6b7280]"><strong>{ready.count ?? "—"}</strong> yayına hazır · <strong>{waiting.count ?? "—"}</strong> bekleyen · <strong>{rejected.count ?? "—"}</strong> reddedilen</p>
    <p className="admin-list-description">Kaynaklı sözler, Türkçe çeviri ve lisanslı yazar portresi otomatik hazırlanır. Ücretli API kullanılmaz; uygun sonuç bulunamazsa hazır havuz devam eder.</p>
    {today?.quote ? <div className="my-6 rounded-xl border border-[#e5e7eb] bg-white p-5"><p className="text-xs text-[#6b7280]">BUGÜN · {today.date}</p><p className="mt-2 text-lg">{today.quote.text}</p><p className="mt-2 text-sm">— {today.quote.author}</p></div> : null}
    {error ? <p role="alert" className="my-5 rounded-xl bg-amber-50 p-5 text-sm">{quoteSetupMessage}</p> : null}
    <QuoteCollectButton disabled={!!error} />
    {lastRun?.details ? <div className="my-4 rounded-xl border border-[#e5e7eb] bg-white p-4 text-sm leading-relaxed" role="status">
      <p>Son tarama: {Number(lastRun.details.found ?? 0)} yeni söz · {Number(lastRun.details.approved ?? 0)} otomatik hazırlanan · {Number(lastRun.details.pending ?? 0)} bekleyen.</p>
      <p className="mt-2 text-xs text-[#6b7280]">Yazarlar: {Array.isArray(lastRun.details.authors) ? lastRun.details.authors.join(", ") : "—"}. {Number(lastRun.details.unavailable ?? 0)} kaynak erişilemedi, {Number(lastRun.details.unmatched ?? 0)} metin eşleşmedi. Sonraki tarama kaldığı yerden devam eder.</p>
    </div> : null}
    <p className="my-4 text-xs leading-relaxed text-[#6b7280]">{automaticApprovalEnabled() ? "Otomatik mod açık: kaynak ve çeviri kontrollerini geçen sözler havuza alınır." : "Elle onay modu: otomatik hazırlanan sözler onayını bekler."} Günlük seçim İstanbul tarihine göre sabitlenir. Otomatik çevirileri buradan düzeltebilir veya reddedebilirsin. Fotoğraf bulunamazsa baş harfler kullanılır.</p>
    <nav aria-label="Söz durumları" className="my-6 flex flex-wrap gap-4 text-sm">{[["pending", "Bekleyenler"], ["approved", "Onaylı havuz"], ["rejected", "Reddedilenler"]].map(([value, label]) => <Link key={value} href={`/admin/quotes?status=${value}`} aria-current={status === value ? "page" : undefined} className={status === value ? "font-semibold underline" : "text-[#6b7280]"}>{label}</Link>)}</nav>
    <div className="grid gap-5">{(data as QuoteReviewRow[] | null)?.map((quote) => <QuoteReview key={quote.id} quote={quote} />)}</div>
    {!error && !data?.length ? <p className="py-10 text-sm text-[#6b7280]">Bu bölümde henüz söz yok.</p> : null}
  </section>;
}
