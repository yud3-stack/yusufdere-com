"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, FileText, Folder, Search, X } from "lucide-react";

export type SearchItem = {
  href: string;
  title: string;
  kind: "Yazı" | "Proje";
  keywords: string;
};

export function SearchClient({ items, unavailable }: { items: SearchItem[]; unavailable: boolean }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const popupId = useId();
  const inputId = useId();
  const titleId = useId();
  const router = useRouter();
  const needle = query.trim().toLocaleLowerCase("tr");
  const results = items.filter(item => !needle || `${item.title} ${item.keywords}`.toLocaleLowerCase("tr").includes(needle));
  const visible = results.slice(0, 8);

  function closeSearch() {
    setOpen(false);
    dialogRef.current?.close();
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!needle) {
      setOpen(true);
      desktopInputRef.current?.focus();
      return;
    }
    if (visible[0]) {
      closeSearch();
      router.push(visible[0].href);
    }
  }

  function resultList() {
    return (
      <div className="search-results">
        <p className="search-caption" role="status">{needle ? `${results.length} sonuç` : "Yazılar ve projeler"}</p>
        {unavailable ? <p className="search-notice">Bazı içerikler şu an yüklenemedi.</p> : null}
        {visible.length > 0 ? (
          <ul>
            {visible.map(item => (
              <li key={item.href}>
                <Link href={item.href} onClick={closeSearch}>
                  {item.kind === "Yazı" ? <FileText size={18} aria-hidden="true" /> : <Folder size={18} aria-hidden="true" />}
                  <span><span className="search-kind">{item.kind}</span><span className="search-title">{item.title}</span></span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : <p className="search-empty">{unavailable ? "İçerikler yüklenemedi. Daha sonra tekrar deneyebilirsin." : "Bu aramaya uygun yazı veya proje bulunamadı."}</p>}
      </div>
    );
  }

  return (
    <div className="header-search">
      <div className="desktop-search" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
        <form role="search" onSubmit={submit} onKeyDown={event => {
          if (event.key === "Escape") { event.preventDefault(); desktopInputRef.current?.focus(); setOpen(false); }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            document.getElementById(popupId)?.querySelector<HTMLAnchorElement>("a")?.focus();
          }
        }}>
          <div className="search-field">
            <label htmlFor={inputId} className="sr-only">Yazı ve projelerde ara</label>
            <input id={inputId} ref={desktopInputRef} type="search" value={query} onChange={event => { setQuery(event.target.value); setOpen(true); }} onFocus={() => setOpen(true)} placeholder="Yazı ve projelerde ara…" aria-controls={open ? popupId : undefined} autoComplete="off" />
            <button type="submit" aria-label="İlk arama sonucunu aç"><Search size={17} aria-hidden="true" /></button>
          </div>
        </form>
        {open ? <div id={popupId} className="search-popover" onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); desktopInputRef.current?.focus(); setOpen(false); } }}>{resultList()}</div> : null}
      </div>
      <button className="mobile-search-button" type="button" aria-label="Sitede ara" onClick={() => { dialogRef.current?.showModal(); mobileInputRef.current?.focus(); }}><Search size={20} aria-hidden="true" /></button>
      <dialog ref={dialogRef} className="search-dialog" aria-labelledby={titleId} onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); closeSearch(); } }} onClick={event => { if (event.target === event.currentTarget) closeSearch(); }}>
        <div className="search-dialog-heading"><h2 id={titleId}>Sitede ara</h2><button type="button" aria-label="Aramayı kapat" onClick={closeSearch}><X size={20} aria-hidden="true" /></button></div>
        <form role="search" onSubmit={submit}>
          <label className="search-field">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Mobil yazı ve proje araması</span>
            <input ref={mobileInputRef} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Yazı ve projelerde ara…" autoComplete="off" />
          </label>
        </form>
        {resultList()}
      </dialog>
    </div>
  );
}
