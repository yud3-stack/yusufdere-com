"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Brand } from "@/components/layout/Brand";
import { publicNavigation } from "@/components/layout/navigation";
import { site } from "@/data/site";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { publicSocialLinks } from "@/components/layout/public-links";
import { openCookiePreferences } from "@/lib/cookies/consent";

const navigation = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projeler" },
  { href: "/about", label: "Hakkımda" },
];

const connections = [
  site.githubUrl ? { href: site.githubUrl, label: "GitHub", external: true } : null,
  site.linkedinUrl ? { href: site.linkedinUrl, label: "LinkedIn", external: true } : null,
  site.instagramUrl ? { href: site.instagramUrl, label: "Instagram", external: true } : null,
  site.email ? { href: `mailto:${site.email}`, label: "E-posta", external: false } : null,
].flatMap((item) => (item ? [item] : []));

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#E5E7EB] bg-[#FAFAF9]">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 text-[15px] font-medium text-[#111827]">
            <span className="text-[#F59E0B]">&lt;/&gt;</span>
            Yusuf Dere.
          </p>
          <p className="mt-2 text-sm text-[#111827]">{site.role}</p>
          <p className="mt-2 text-sm text-[#9CA3AF]">Yazılım, projeler ve öğrendiklerim üzerine.</p>
        </div>
        <nav aria-label="Alt">
          <p className="text-sm font-medium text-[#111827]">Navigasyon</p>
          <ul className="mt-3 space-y-2">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-[#6B7280] hover:text-[#111827]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {connections.length > 0 ? (
          <div>
            <p className="text-sm font-medium text-[#111827]">Bağlantılar</p>
            <ul className="mt-3 space-y-2">
              {connections.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="text-sm text-[#6B7280] hover:text-[#111827]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>
      <Container className="border-t border-[#E5E7EB] py-5">
        <p className="text-sm text-[#9CA3AF]">© {year} Yusuf Dere.</p>
      </Container>
    </footer>
  );
}

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <Container>
        <div className="footer-row">
          <div className="footer-identity"><Brand /><p>Yazılım, projeler ve öğrendiklerim üzerine.</p></div>
          <nav aria-label="Alt navigasyon">
            {publicNavigation.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}
          </nav>
          <div className="footer-connections">
            {publicSocialLinks.map(item => (
              <a key={item.label} href={item.href} aria-label={item.label} title={item.label} {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <SocialIcon kind={item.kind} />
              </a>
            ))}
            <a href="#icerik" className="back-to-top" aria-label="Sayfanın başına dön"><ArrowUp size={17} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="footer-legal">
          <p className="copyright">© {new Date().getFullYear()} Yusuf Dere.</p>
          <nav aria-label="Yasal">
            <Link href="/privacy">Gizlilik ve çerezler</Link>
            <button type="button" onClick={() => openCookiePreferences("settings")}>
              Çerez tercihleri
            </button>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
