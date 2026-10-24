"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { ArrowUpRight, ChartNoAxesCombined, CodeXml, FileText, FolderKanban, LayoutDashboard, LogOut, Menu, Plus, Quote, Radar, Search, X, type LucideIcon } from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { SocialIcon } from "@/components/layout/SocialIcon";

function InstagramNavIcon({ size }: { size?: number }) {
  return <SocialIcon kind="instagram" size={size ?? 19} />;
}

export type AdminSearchItem = { title: string; href: string; kind: string };
const links: { href: string; label: string; icon: LucideIcon | typeof InstagramNavIcon }[] = [
  { href: "/admin", label: "Genel bakış", icon: LayoutDashboard },
  { href: "/admin#radar", label: "Radar", icon: Radar },
  { href: "/admin/analytics", label: "İstatistikler", icon: ChartNoAxesCombined },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramNavIcon },
  { href: "/admin/quotes", label: "Günün sözü", icon: Quote },
  { href: "/admin/posts", label: "Yazılar", icon: FileText },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
];

export function AdminShell({ children, email, items }: { children: React.ReactNode; email?: string; items: AdminSearchItem[] }) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const results = query.trim() ? items.filter(item => item.title.toLocaleLowerCase("tr").includes(query.trim().toLocaleLowerCase("tr"))).slice(0, 8) : [];
  const current = links.find(link => link.href === "/admin" ? pathname === link.href : pathname.startsWith(link.href));

  function navigation() {
    return <>
      <Link href="/admin" className="admin-brand" onClick={() => dialog.current?.close()}><span><CodeXml size={23} /></span>Yusuf Dere<span className="admin-brand-dot">.</span></Link>
      <p className="admin-studio-label">YÖNETİM STÜDYOSU</p>
      <p className="admin-nav-label">ÇALIŞMA ALANI</p>
      <nav aria-label="Yönetim navigasyonu">{links.map(({ href, label, icon: Icon }) => {
        const pathOnly = href.split("#")[0] || href;
        const active = href === "/admin"
          ? pathname === "/admin"
          : href.includes("#")
            ? pathname === pathOnly
            : pathname.startsWith(href);
        // Radar lives on the overview; mark Genel bakış current there, not both.
        const current = href === "/admin#radar" ? undefined : active ? "page" as const : undefined;
        return <Link key={href} href={href} aria-current={current} onClick={() => dialog.current?.close()}><Icon size={19} />{label}</Link>;
      })}</nav>
      <p className="admin-nav-label">KISAYOLLAR</p>
      <nav aria-label="İçerik kısayolları"><Link href="/admin/posts/new" onClick={() => dialog.current?.close()}><Plus size={19} />Yeni yazı</Link><Link href="/admin/projects/new" onClick={() => dialog.current?.close()}><Plus size={19} />Yeni proje</Link></nav>
      <div className="admin-sidebar-bottom"><div className="admin-site-card"><span>KİŞİSEL ALANIN</span><p>Fikirlerin yayına hazır.</p><Link href="/">Siteyi görüntüle<ArrowUpRight size={17} /></Link></div><form action={logout}><button className="admin-logout" type="submit"><LogOut size={18} />Çıkış yap</button></form></div>
    </>;
  }

  return <div className="admin-frame">
    <aside className="admin-sidebar">{navigation()}</aside>
    <dialog ref={dialog} className="admin-mobile-drawer" aria-label="Yönetim menüsü"><button className="admin-icon-button admin-drawer-close" onClick={() => dialog.current?.close()} aria-label="Menüyü kapat"><X size={20} /></button>{navigation()}</dialog>
    <div className="admin-main">
      <header className="admin-topbar">
        <button className="admin-icon-button admin-mobile-toggle" aria-label="Yönetim menüsünü aç" onClick={() => dialog.current?.showModal()}><Menu size={21} /></button>
        <div className="admin-search" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }}>
          <Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="admin-search">Yazı ve projelerde ara</label><input id="admin-search" type="search" placeholder="Yazı ve projelerde ara…" value={query} autoComplete="off" aria-controls="admin-search-results" onFocus={() => setSearchOpen(true)} onChange={event => { setQuery(event.target.value); setSearchOpen(true); }} onKeyDown={event => { if (event.key === "Escape") setSearchOpen(false); }} />
          {searchOpen && query.trim() ? <div id="admin-search-results" className="admin-search-results"><p className="admin-search-caption">İçerik sonuçları</p>{results.length ? results.map(item => <Link key={item.href} href={item.href} onClick={() => { setSearchOpen(false); setQuery(""); }}><span>{item.kind}</span><strong>{item.title}</strong><ArrowUpRight size={16} /></Link>) : <p role="status">Eşleşen içerik bulunamadı.</p>}</div> : null}
        </div>
        <Link href="/" className="admin-view-site">Siteyi aç <ArrowUpRight size={16} /></Link>
        <div className="admin-account"><span className="admin-avatar" aria-hidden="true">YD</span><div><strong>Yusuf Dere</strong><span>{email || "Site yöneticisi"}</span></div></div>
      </header>
      <div className="admin-content"><p className="admin-breadcrumb">Çalışma alanı <span>/</span> {current?.label ?? "Yönetim"}</p>{children}</div>
      <footer className="admin-bottomline"><span>Yusuf Dere · İçerik yönetimi</span><span>Yaz. Geliştir. Paylaş.</span></footer>
    </div>
  </div>;
}

