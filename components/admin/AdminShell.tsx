"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  ArrowUpRight,
  Bell,
  ChartNoAxesCombined,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Quote,
  Search,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { logout } from "@/lib/auth/actions";
import { SocialIcon } from "@/components/layout/SocialIcon";

function InstagramNavIcon({ size }: { size?: number }) {
  return <SocialIcon kind="instagram" size={size ?? 20} />;
}

export type AdminSearchItem = { title: string; href: string; kind: string };

const links: {
  href: string;
  label: string;
  icon: LucideIcon | typeof InstagramNavIcon;
}[] = [
  { href: "/admin", label: "Genel bakış", icon: LayoutDashboard },
  { href: "/admin/posts", label: "Yazılar", icon: FileText },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban },
  { href: "/admin/analytics", label: "İstatistikler", icon: ChartNoAxesCombined },
  { href: "/admin/instagram", label: "Instagram", icon: InstagramNavIcon },
  { href: "/admin/quotes", label: "Günün sözü", icon: Quote },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  children,
  email,
  items,
}: {
  children: React.ReactNode;
  email?: string;
  items: AdminSearchItem[];
}) {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const results = query.trim()
    ? items
        .filter(item =>
          item.title
            .toLocaleLowerCase("tr")
            .includes(query.trim().toLocaleLowerCase("tr")),
        )
        .slice(0, 8)
    : [];
  const current =
    links.find(link => isActive(pathname, link.href)) ?? links[0];
  const today = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  function navLinks(onNavigate?: () => void) {
    return (
      <nav aria-label="Yönetim navigasyonu" className="admin-rail-nav">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="admin-frame">
      <aside className="admin-rail" aria-label="Ana menü">
        <Link href="/admin" className="admin-rail-brand" aria-label="Admin ana sayfa">
          <span>YD</span>
        </Link>
        {navLinks()}
        <div className="admin-rail-bottom">
          <Link href="/" className="admin-rail-link" aria-label="Siteyi görüntüle" title="Siteyi görüntüle">
            <ArrowUpRight size={20} />
          </Link>
          <form action={logout}>
            <button type="submit" className="admin-rail-link" aria-label="Çıkış yap" title="Çıkış yap">
              <LogOut size={20} />
            </button>
          </form>
        </div>
      </aside>

      <dialog
        ref={dialog}
        className="admin-mobile-drawer"
        aria-label="Yönetim menüsü"
      >
        <button
          type="button"
          className="admin-icon-btn admin-drawer-close"
          onClick={() => dialog.current?.close()}
          aria-label="Menüyü kapat"
        >
          <X size={18} />
        </button>
        <p className="admin-drawer-title">Yönetim</p>
        <nav aria-label="Mobil yönetim navigasyonu" className="admin-drawer-nav">
          {links.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                onClick={() => dialog.current?.close()}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
        <form action={logout} className="admin-drawer-logout">
          <button type="submit">
            <LogOut size={18} />
            Çıkış yap
          </button>
        </form>
      </dialog>

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-icon-btn admin-mobile-toggle"
            aria-label="Yönetim menüsünü aç"
            onClick={() => dialog.current?.showModal()}
          >
            <Menu size={20} />
          </button>

          <div className="admin-topbar-title">
            <p className="admin-greeting">
              {pathname === "/admin" ? "Merhaba, Yusuf" : current.label}
            </p>
            {pathname === "/admin" ? (
              <p className="admin-greeting-sub">
                Bu ay içerik alanında neler oluyor.
              </p>
            ) : null}
          </div>

          <div
            className="admin-search"
            onBlur={event => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSearchOpen(false);
              }
            }}
          >
            <Search size={16} aria-hidden="true" />
            <label className="sr-only" htmlFor="admin-search">
              Yazı ve projelerde ara
            </label>
            <input
              id="admin-search"
              type="search"
              placeholder="Ara…"
              value={query}
              autoComplete="off"
              aria-controls="admin-search-results"
              onFocus={() => setSearchOpen(true)}
              onChange={event => {
                setQuery(event.target.value);
                setSearchOpen(true);
              }}
              onKeyDown={event => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
            />
            <time className="admin-search-date" dateTime={new Date().toISOString()}>
              {today}
            </time>
            {searchOpen && query.trim() ? (
              <div id="admin-search-results" className="admin-search-results">
                <p className="admin-search-caption">Sonuçlar</p>
                {results.length ? (
                  results.map(item => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setSearchOpen(false);
                        setQuery("");
                      }}
                    >
                      <span>{item.kind}</span>
                      <strong>{item.title}</strong>
                      <ArrowUpRight size={14} />
                    </Link>
                  ))
                ) : (
                  <p role="status">Eşleşen içerik yok.</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="admin-topbar-actions">
            <Link
              href="/admin/analytics"
              className="admin-icon-btn"
              aria-label="İstatistikler"
              title="İstatistikler"
            >
              <Settings size={18} />
            </Link>
            <Link
              href="/admin/instagram"
              className="admin-icon-btn"
              aria-label="Bildirimler"
              title="Instagram"
            >
              <Bell size={18} />
            </Link>
            <div className="admin-avatar" title={email || "Yönetici"} aria-hidden="true">
              YD
            </div>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
