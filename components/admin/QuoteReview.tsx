"use client";

import { useActionState } from "react";
import Image from "next/image";
import { collectQuotesAction, reviewQuoteAction } from "@/lib/quotes/actions";
import type { QuoteReviewRow } from "@/lib/quotes/store";

const initial = { ok: false, message: "" };

const statusLabel = {
  pending: "İnceleme bekliyor",
  approved: "Onaylı",
  rejected: "Reddedildi",
} as const;

function splitCollectMessage(message: string) {
  const parts = message
    .split(/(?<=\.)\s+/)
    .map(part => part.trim())
    .filter(Boolean);
  const warnings = parts.filter(part => part.includes(":"));
  const summary = parts.filter(part => !part.includes(":")).join(" ");
  return { summary: summary || message, warnings };
}

export function QuoteCollectButton({ disabled }: { disabled: boolean }) {
  const [state, action, pending] = useActionState(collectQuotesAction, initial);
  const result = state.message ? splitCollectMessage(state.message) : null;

  return (
    <form action={action} className="admin-card admin-quote-collect">
      <div className="admin-card-heading">
        <h2>Tarama</h2>
        <span>Wikiquote · özgün kaynak</span>
      </div>
      <button className="admin-button primary" disabled={disabled || pending}>
        {pending ? "Taranıyor… 30–40 sn sürebilir" : "Sözleri bul ve otomatik hazırla"}
      </button>
      {pending ? (
        <p role="status" className="admin-field-hint">
          Yazar sayfaları ve kaynaklar kontrol ediliyor…
        </p>
      ) : null}
      {result && state.ok ? (
        <div role="status" className="admin-quote-collect-result">
          <p className="admin-quote-collect-ok">{result.summary}</p>
          {result.warnings.length ? (
            <ul className="admin-quote-collect-warnings">
              {result.warnings.map(warning => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
      {state.message && !state.ok ? (
        <p role="status" className="admin-error" style={{ marginTop: 12, marginBottom: 0 }}>
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

export function QuoteReview({ quote }: { quote: QuoteReviewRow }) {
  const [state, action, pending] = useActionState(
    reviewQuoteAction.bind(null, quote.id),
    initial,
  );
  const badge = quote.auto_approved ? "Otomatik hazırlandı" : statusLabel[quote.status];

  return (
    <article className="admin-card admin-quote-review">
      <div className="admin-card-heading">
        <h2>{quote.author}</h2>
        <span className={`admin-quote-badge ${quote.status}`}>{badge}</span>
      </div>

      <blockquote className="admin-quote-original" lang="en">
        {quote.original}
      </blockquote>

      <p className="admin-field-hint">
        {quote.auto_approved
          ? "Kaynak ve otomatik çeviri kontrolleri geçti. İstersen metni düzenleyebilir veya havuzdan çıkarabilirsin."
          : "Kaynak metninde eşleşme bulundu. Atıf ve çeviri doğruluğunu buradan kontrol edebilirsin."}
      </p>

      <div className="admin-quote-links">
        <a href={quote.source_url} target="_blank" rel="noopener noreferrer">
          Özgün kaynak · {quote.source_title || new URL(quote.source_url).hostname}
        </a>
        {quote.discovery_url ? (
          <a href={quote.discovery_url} target="_blank" rel="noopener noreferrer">
            Wikiquote sabit revizyonu
          </a>
        ) : null}
      </div>

      {quote.automation_note ? (
        <p className="admin-quote-note">{quote.automation_note}</p>
      ) : null}

      <form action={action} className="admin-quote-form">
        <label className="admin-field">
          Türkçe çeviri
          <textarea
            name="translation"
            rows={3}
            minLength={10}
            maxLength={320}
            required
            defaultValue={quote.translation ?? ""}
          />
        </label>
        <label className="admin-field">
          Görselde gösterilecek kaynak adı
          <input
            name="sourceLabel"
            maxLength={150}
            required
            defaultValue={quote.source_label || new URL(quote.source_url).hostname}
          />
        </label>
        <label className="admin-field">
          Çeviri / alıntı notu
          <input
            name="sourceNote"
            maxLength={120}
            required
            defaultValue={quote.source_note}
          />
        </label>

        <details className="admin-quote-portrait">
          <summary>Yazar portresi ve fotoğraf kredisi</summary>
          {quote.portrait_src ? (
            <Image
              src={quote.portrait_src}
              alt={`${quote.author} portresi`}
              width={120}
              height={120}
              unoptimized
              className="admin-quote-portrait-img"
            />
          ) : null}
          {quote.portrait_source_url ? (
            <a
              className="admin-quote-link-quiet"
              href={quote.portrait_source_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fotoğrafın Commons kaydı
            </a>
          ) : null}
          {quote.portrait_license_url ? (
            <a
              className="admin-quote-link-quiet"
              href={quote.portrait_license_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fotoğraf lisansı
            </a>
          ) : null}
          <p className="admin-field-hint">
            Portre boşsa yazarın baş harfleri kullanılır. İzinli yerel görsel veya
            upload.wikimedia.org bağlantısı ekleyebilirsin.
          </p>
          <label className="admin-field">
            Portre adresi
            <input name="portraitSrc" defaultValue={quote.portrait_src} />
          </label>
          <label className="admin-field">
            Fotoğrafçı ve lisans
            <input name="portraitCredit" defaultValue={quote.portrait_credit} />
          </label>
        </details>

        <label className="admin-quote-check">
          <input name="reviewed" value="yes" type="checkbox" />
          <span>
            Kaynağı ve Türkçe çeviriyi, portre eklediysem fotoğraf kullanım bilgisini
            kontrol ettim.
          </span>
        </label>

        <div className="admin-actions">
          <button
            name="decision"
            value="approve"
            className="admin-button primary"
            disabled={pending}
          >
            {quote.status === "approved" ? "Değişiklikleri kaydet" : "Onayla ve havuza al"}
          </button>
          <button
            name="decision"
            value="reject"
            formNoValidate
            className="admin-button"
            disabled={pending}
          >
            Reddet / havuzdan çıkar
          </button>
        </div>

        {pending || state.message ? (
          <p
            role="status"
            className={state.ok || pending ? "admin-field-hint" : "admin-error"}
            style={
              state.ok
                ? { margin: 0, color: "var(--admin-green)" }
                : pending
                  ? { margin: 0 }
                  : { margin: 0 }
            }
          >
            {pending ? "Kaydediliyor…" : state.message}
          </p>
        ) : null}
      </form>
    </article>
  );
}
