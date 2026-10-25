import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";
import { quoteSetupMessage, type QuoteReviewRow } from "@/lib/quotes/store";
import { QuoteCollectButton, QuoteReview } from "@/components/admin/QuoteReview";
import { automaticApprovalEnabled } from "@/lib/quotes/automation";

export const metadata = { title: "Günün sözü", robots: { index: false, follow: false } };
export const maxDuration = 60;

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin.ok) return <p className="admin-error">Bu işlem için yetkin yok.</p>;
  const { status: selected } = await searchParams;
  const status = ["pending", "approved", "rejected"].includes(selected ?? "")
    ? selected!
    : "pending";
  const { data, error } = await admin.supabase
    .from("quote_candidates")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(100);
  const { data: today } = await admin.supabase.rpc("current_daily_quote");
  const { data: lastRun } = await admin.supabase
    .from("quote_discovery_progress")
    .select("details,updated_at")
    .eq("author", "__catalog__")
    .maybeSingle();
  const [ready, waiting, rejected] = await Promise.all([
    admin.supabase
      .from("quote_candidates")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),
    admin.supabase
      .from("quote_candidates")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
    admin.supabase
      .from("quote_candidates")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),
  ]);

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Günlük içerik</p>
          <h1>Günün sözü</h1>
          <p className="admin-list-description">
            Kaynaklı sözler, Türkçe çeviri ve yazar portresi otomatik hazırlanır.
          </p>
        </div>
      </div>

      <div className="admin-status-strip">
        <div className="admin-status-card green">
          <p>Yayına hazır</p>
          <strong>{ready.count ?? "—"}</strong>
        </div>
        <div className="admin-status-card orange">
          <p>Bekleyen</p>
          <strong>{waiting.count ?? "—"}</strong>
        </div>
        <div className="admin-status-card yellow">
          <p>Reddedilen</p>
          <strong>{rejected.count ?? "—"}</strong>
        </div>
        <div className="admin-status-card blue">
          <p>Mod</p>
          <strong style={{ fontSize: 16, marginTop: 16 }}>
            {automaticApprovalEnabled() ? "Otomatik" : "Elle"}
          </strong>
        </div>
      </div>

      {today?.quote ? (
        <div className="admin-card admin-quote-today">
          <p className="admin-eyebrow">Bugün · {today.date}</p>
          <p>{today.quote.text}</p>
          <p>— {today.quote.author}</p>
        </div>
      ) : null}

      {error ? (
        <p role="alert" className="admin-error">
          {quoteSetupMessage}
        </p>
      ) : null}

      <QuoteCollectButton disabled={!!error} />

      {lastRun?.details ? (
        <div className="admin-card" style={{ marginBottom: 16 }} role="status">
          <div className="admin-card-heading">
            <h2>Son tarama</h2>
            <span>
              {Number(lastRun.details.found ?? 0)} yeni ·{" "}
              {Number(lastRun.details.pending ?? 0)} bekleyen
            </span>
          </div>
          <p className="admin-list-description" style={{ margin: 0 }}>
            Yazarlar:{" "}
            {Array.isArray(lastRun.details.authors)
              ? lastRun.details.authors.join(", ")
              : "—"}
            . {Number(lastRun.details.unavailable ?? 0)} kaynak erişilemedi,{" "}
            {Number(lastRun.details.unmatched ?? 0)} metin eşleşmedi.
          </p>
        </div>
      ) : null}

      <nav aria-label="Söz durumları" className="admin-periods">
        {(
          [
            ["pending", "Bekleyenler"],
            ["approved", "Onaylı havuz"],
            ["rejected", "Reddedilenler"],
          ] as const
        ).map(([value, label]) => (
          <Link
            key={value}
            href={`/admin/quotes?status=${value}`}
            aria-current={status === value ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="admin-quote-list">
        {(data as QuoteReviewRow[] | null)?.map(quote => (
          <QuoteReview key={quote.id} quote={quote} />
        ))}
      </div>
      {!error && !data?.length ? (
        <p className="admin-empty">Bu bölümde henüz söz yok.</p>
      ) : null}
    </section>
  );
}
