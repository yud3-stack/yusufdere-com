"use client";

import { useActionState } from "react";
import Image from "next/image";
import { collectQuotesAction, reviewQuoteAction } from "@/lib/quotes/actions";
import type { QuoteReviewRow } from "@/lib/quotes/store";

const initial = { ok: false, message: "" };
export function QuoteCollectButton({ disabled }: { disabled: boolean }) {
  const [state, action, pending] = useActionState(collectQuotesAction, initial);
  return <form action={action}>
    <button className="admin-button primary" disabled={disabled || pending}>{pending ? "Otomatik hazırlanıyor…" : "Sözleri bul ve otomatik hazırla"}</button>
    <p role="status" className="mt-3 text-sm">{state.message}</p>
  </form>;
}

export function QuoteReview({ quote }: { quote: QuoteReviewRow }) {
  const [state, action, pending] = useActionState(reviewQuoteAction.bind(null, quote.id), initial);
  return <article className="rounded-2xl border border-[#e5e7eb] bg-white p-5 sm:p-7">
    <div className="flex flex-wrap justify-between gap-3"><h2 className="text-xl font-semibold">{quote.author}</h2><span className="text-sm text-[#6b7280]">{quote.auto_approved ? "Otomatik hazırlandı" : ({ pending: "İnceleme bekliyor", approved: "Onaylı", rejected: "Reddedildi" })[quote.status]}</span></div>
    <blockquote className="my-5 text-lg leading-relaxed" lang="en">{quote.original}</blockquote>
    <p className="text-sm text-[#6b7280]">{quote.auto_approved ? "Kaynak ve otomatik çeviri kontrolleri geçti. İstersen metni düzenleyebilir veya havuzdan çıkarabilirsin." : "Kaynak metninde eşleşme bulundu. Atıf ve çeviri doğruluğunu buradan kontrol edebilirsin."}</p>
    <a className="mt-3 block break-words text-sm underline" href={quote.source_url} target="_blank" rel="noopener noreferrer">Özgün kaynağı aç · {quote.source_title}</a>
    {quote.discovery_url ? <a className="mt-2 block text-sm underline" href={quote.discovery_url} target="_blank" rel="noopener noreferrer">Keşif kaydı · Wikiquote sabit revizyonu</a> : null}
    {quote.automation_note ? <p className="mt-4 rounded-lg bg-[#f5f6f3] p-3 text-xs leading-relaxed">{quote.automation_note}</p> : null}
    <form action={action} className="mt-6 grid gap-4">
      <label className="grid gap-2 text-sm">Türkçe çeviri<textarea className="rounded-lg border border-[#d1d5db] p-3" name="translation" rows={3} minLength={10} maxLength={320} required defaultValue={quote.translation ?? ""} /></label>
      <label className="grid gap-2 text-sm">Görselde gösterilecek kaynak adı<input className="rounded-lg border border-[#d1d5db] p-3" name="sourceLabel" maxLength={150} required defaultValue={quote.source_label || new URL(quote.source_url).hostname} /></label>
      <label className="grid gap-2 text-sm">Çeviri / alıntı notu<input className="rounded-lg border border-[#d1d5db] p-3" name="sourceNote" maxLength={120} required defaultValue={quote.source_note} /></label>
      <details><summary className="cursor-pointer text-sm">Yazar portresi ve fotoğraf kredisi</summary>
        {quote.portrait_src ? <Image src={quote.portrait_src} alt={`${quote.author} portresi`} width={120} height={120} unoptimized className="mt-4 h-30 w-30 object-cover grayscale" /> : null}
        {quote.portrait_source_url ? <a className="mt-3 block text-xs underline" href={quote.portrait_source_url} target="_blank" rel="noopener noreferrer">Fotoğrafın Commons kaydı</a> : null}
        {quote.portrait_license_url ? <a className="mt-2 block text-xs underline" href={quote.portrait_license_url} target="_blank" rel="noopener noreferrer">Fotoğraf lisansı</a> : null}
        <p className="my-3 text-xs text-[#6b7280]">Portre boşsa yazarın baş harfleri kullanılır. İzinli yerel görsel veya upload.wikimedia.org bağlantısı ekleyebilirsin.</p>
        <label className="mb-3 grid gap-2 text-sm">Portre adresi<input className="rounded-lg border border-[#d1d5db] p-3" name="portraitSrc" defaultValue={quote.portrait_src} /></label>
        <label className="grid gap-2 text-sm">Fotoğrafçı ve lisans<input className="rounded-lg border border-[#d1d5db] p-3" name="portraitCredit" defaultValue={quote.portrait_credit} /></label>
      </details>
      <label className="flex items-start gap-3 text-sm leading-relaxed"><input className="mt-1" name="reviewed" value="yes" type="checkbox" />Kaynağı ve Türkçe çeviriyi, portre eklediysem fotoğraf kullanım bilgisini kontrol ettim.</label>
      <div className="flex flex-wrap gap-3"><button name="decision" value="approve" className="admin-button primary" disabled={pending}>{quote.status === "approved" ? "Değişiklikleri kaydet" : "Onayla ve havuza al"}</button><button name="decision" value="reject" formNoValidate className="admin-button" disabled={pending}>Reddet / havuzdan çıkar</button></div>
      <p role="status" className={`text-sm ${state.ok ? "text-green-800" : "text-red-700"}`}>{pending ? "Kaydediliyor…" : state.message}</p>
    </form>
  </article>;
}
