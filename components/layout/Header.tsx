"use client";

import { useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Brand } from "@/components/layout/Brand";
import { publicNavigation } from "@/components/layout/navigation";

const links = [
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projeler" },
  { href: "/about", label: "Hakkında" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ search }: { search?: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/admin" || pathname.startsWith("/admin/") ? (
    <HeaderBar key={pathname} pathname={pathname} />
  ) : (
    <PublicHeaderBar key={pathname} pathname={pathname} search={search} />
  );
}

function HeaderBar({ pathname }: { pathname: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
      <Container className="flex h-[72px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-medium text-[#111827]"
        >
          <span className="text-[#F59E0B]">&lt;/&gt;</span>
          Yusuf Dere.
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          aria-label="Ana"
        >
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-sm text-[#6B7280] transition-colors duration-200 hover:text-[#111827]"
                aria-current={active ? "page" : undefined}
              >
                <span className={active ? "text-[#111827]" : undefined}>
                  {link.label}
                </span>
                {active ? (
                  <span className="absolute -bottom-2 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[#F59E0B]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111827] transition-colors duration-200 hover:bg-[#F8F8F6] lg:hidden"
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </Container>

      {menuOpen ? (
        <nav
          className="border-t border-[#E5E7EB] bg-white lg:hidden"
          aria-label="Mobil"
        >
          <Container className="flex flex-col py-3">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-between border-b border-[#E5E7EB] py-4 text-lg text-[#111827] last:border-b-0"
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                  {active ? (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                  ) : null}
                </Link>
              );
            })}
          </Container>
        </nav>
      ) : null}
    </header>
  );
}

function PublicHeaderBar({
  pathname,
  search,
}: {
  pathname: string;
  search?: ReactNode;
}) {
  const menu = useRef<HTMLDetailsElement>(null);

  return (
    <header
      className="public-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menu.current?.open) {
          menu.current.open = false;
          menu.current.querySelector("summary")?.focus();
        }
      }}
    >
      <Container className="public-header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Ana navigasyon">
          {publicNavigation.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(pathname, link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {search}
          <a href="mailto:hello@yusufdere.com" className="header-contact">
            İletişime geç <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <details ref={menu} className="mobile-menu">
          <summary className="menu-button" aria-label="Ana menü" aria-controls="public-mobile-nav">
            <Menu className="menu-open-icon" size={21} aria-hidden="true" />
            <X className="menu-close-icon" size={21} aria-hidden="true" />
          </summary>
        <nav
          id="public-mobile-nav"
          className="mobile-nav"
          aria-label="Mobil navigasyon"
        >
          <Container>
            {publicNavigation.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={
                  isActive(pathname, link.href) ? "page" : undefined
                }
                onClick={() => { if (menu.current) menu.current.open = false; }}
              >
                {link.label}
              </a>
            ))}
          </Container>
        </nav>
        </details>
      </Container>
    </header>
  );
}
