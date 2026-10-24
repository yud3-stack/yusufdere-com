"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Copy, Download, MessageCircle, Share2, X } from "lucide-react";
import { getDailyQuote, quoteDate, type DailyQuote } from "@/data/quotes";
import { Modal } from "@/components/ui/Modal";
import { imageShareIssue } from "@/lib/quote-sharing";

function subscribeDate(update: () => void) {
  const timer = window.setInterval(update, 15_000);
  window.addEventListener("focus", update);
  document.addEventListener("visibilitychange", update);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", update);
    document.removeEventListener("visibilitychange", update);
  };
}

export function QuoteCard({ initialDate, initialQuote }: { initialDate: string; initialQuote?: DailyQuote }) {
  const date = useSyncExternalStore(subscribeDate, quoteDate, () => initialDate);
  const [publication, setPublication] = useState<{ date: string; quote: DailyQuote } | null>(() =>
    initialQuote ? { date: initialDate, quote: initialQuote } : null);
  useEffect(() => {
    const controller = new AbortController();
    async function refresh() {
      try {
        const response = await fetch("/api/quotes/today", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const next = await response.json();
        if (next.date === date && next.quote?.id) setPublication((current) =>
          current?.date === date && (next.fallback || current.quote.id === next.quote.id) ? current : next);
      } catch { /* Retain today's local fallback while offline. */ }
    }
    void refresh();
    const timer = window.setInterval(refresh, 300_000);
    window.addEventListener("focus", refresh);
    return () => { controller.abort(); window.clearInterval(timer); window.removeEventListener("focus", refresh); };
  }, [date]);
  const quote = publication?.date === date ? publication.quote : getDailyQuote(date);
  // A new day discards yesterday's file, preview and share state together.
  return <DailyQuoteCard key={`${date}:${quote.id}`} date={date} quote={quote} />;
}

function DailyQuoteCard({ date, quote }: { date: string; quote: DailyQuote }) {
  const [opened, setOpened] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [message, setMessage] = useState("");
  const [prepared, setPrepared] = useState<{ file: File; url: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const shareText = `“${quote.text}” — ${quote.author}\n${quote.sourceUrl}`;
  function close() { setOpened(false); setPrepared(null); setMessage(""); }

  useEffect(() => {
    if (!opened) return;
    let cancelled = false;
    let url = "";
    import("@/lib/quote-share-image").then(({ renderQuoteShareImage }) => renderQuoteShareImage({ ...quote, date })).then((file) => {
      if (cancelled) return;
      url = URL.createObjectURL(file);
      setPrepared({ file, url });
    }).catch(() => {
      if (!cancelled) setMessage("Görsel hazırlanamadı. Pencereyi kapatıp yeniden deneyebilirsin.");
    });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [opened, quote, date]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("soz") === "1") {
      // Retain the existing visual QA URL, with React-managed cleanup.
      const timer = window.setTimeout(() => { setPreviewOnly(true); setOpened(true); }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function download() {
    if (!prepared) return;
    const anchor = document.createElement("a");
    anchor.href = prepared.url;
    anchor.download = prepared.file.name;
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setMessage("1080 × 1920 görsel indirildi.");
  }

  async function shareImage() {
    if (!prepared) return;
    let fileSupport: boolean | undefined;
    try { fileSupport = navigator.canShare?.({ files: [prepared.file] }); }
    catch { fileSupport = false; }
    const issue = imageShareIssue({ secureContext: window.isSecureContext, hasShare: typeof navigator.share === "function", fileSupport });
    if (issue) { setMessage(issue); return; }
    setBusy(true);
    setMessage("");
    try {
      // File is prepared before the click, preserving mobile user activation.
      await navigator.share({ files: [prepared.file] });
      setMessage("Görsel paylaşım menüsüne aktarıldı.");
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError"))
        setMessage("Paylaşım açılamadı. Görseli indirerek paylaşabilirsin.");
    } finally { setBusy(false); }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(shareText); setMessage("Söz ve kaynak kopyalandı."); }
    catch { setMessage("Kopyalama kullanılamıyor. Metni seçerek kopyalayabilirsin."); }
  }

  return <>
    <button type="button" className="floating-card quote-orbit-card" aria-haspopup="dialog"
      onClick={() => setOpened(true)}>
      <span className="floating-card-top">
        <span className="floating-icon lilac"><MessageCircle size={20} aria-hidden="true" /></span>
        <span className="card-kicker">Günün sözü <ArrowUpRight size={13} aria-hidden="true" /></span>
      </span>
      <span className="orbit-quote">“{quote.text}”</span>
      <span className="orbit-author">— {quote.author}</span>
    </button>
    <Modal open={opened && !previewOnly} onClose={close} labelledBy="quote-title">
      <div className="quote-dialog-inner">
        <div className="quote-dialog-top">
          <p className="eyebrow" id="quote-title">Günün sözü</p>
          <button type="button" className="icon-button" aria-label="Pencereyi kapat" onClick={close}><X size={20} /></button>
        </div>
        <blockquote><p>“{quote.text}”</p><cite>— {quote.author}</cite></blockquote>
        <p className="quote-original" lang="en">{quote.original}</p>
        <div className="quote-source">
          <span>Kaynakça · {quote.sourceNote}</span>
          <a href={quote.sourceUrl} target="_blank" rel="noopener noreferrer">{quote.sourceTitle}<ArrowUpRight size={16} aria-hidden="true" /></a>
          {quote.discoveryUrl ? <a href={quote.discoveryUrl} target="_blank" rel="noopener noreferrer">Keşif kaydı · Wikiquote<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
          {quote.portraitSourceUrl ? <a href={quote.portraitSourceUrl} target="_blank" rel="noopener noreferrer">Fotoğraf · {quote.portraitCredit}<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
          {quote.portraitLicenseUrl ? <a href={quote.portraitLicenseUrl} target="_blank" rel="noopener noreferrer">Fotoğraf lisansı<ArrowUpRight size={16} aria-hidden="true" /></a> : null}
        </div>
        <details className="quote-image-preview">
          <summary>Story görselini önizle · 9:16</summary>
          {prepared ? <Image src={prepared.url} alt="Günün sözü paylaşım görseli" width={1080} height={1920} unoptimized /> : <p>Görsel hazırlanıyor…</p>}
        </details>
        <p className="eyebrow share-label">Paylaş</p>
        <div className="quote-share-options">
          <button className="quote-share-primary" disabled={!prepared || busy} type="button" onClick={shareImage} aria-busy={busy}>Görseli paylaş <Share2 size={15} /></button>
          <button disabled={!prepared} type="button" onClick={download}>Görseli indir <Download size={15} /></button>
          <button type="button" onClick={copy}>Metni kopyala <Copy size={15} /></button>
        </div>
        <p className="quote-share-help">Uygulamayı telefonunun paylaşım menüsünden seçebilirsin. Paylaşım için HTTPS bağlantısı gerekir.</p>
        <p className="quote-status" role="status">{busy ? "Paylaşım açılıyor…" : message || (!prepared ? "Görsel hazırlanıyor…" : "1080 × 1920 paylaşım görseli hazır.")}</p>
      </div>
    </Modal>
    {previewOnly && prepared ? createPortal(<div className="quote-full-preview">
      <Image src={prepared.url} alt="Günün sözü 9:16 önizlemesi" width={1080} height={1920} unoptimized />
      <button type="button" onClick={() => { setPreviewOnly(false); close(); }} aria-label="Önizlemeyi kapat"><X /></button>
    </div>, document.body) : null}
  </>;
}
