import Link from "next/link";

import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/content/site";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type SiteHeaderProps = {
  locale?: Locale;
  dictionary?: Dictionary;
};

export function SiteHeader({
  locale = "en",
  dictionary = getDictionary(locale),
}: SiteHeaderProps) {
  const navItems = [
    { label: dictionary.nav.about, href: "/about" },
    { label: dictionary.nav.projects, href: "/projects" },
    { label: dictionary.nav.journal, href: "/journal" },
    { label: dictionary.nav.gallery, href: "/gallery" },
    { label: dictionary.nav.uses, href: "/uses" },
    { label: dictionary.nav.now, href: "/now" },
    { label: dictionary.nav.contact, href: "/contact" },
  ] as const;

  return (
    <header className="border-b border-border">
      <Container className="py-4">
        <div className="flex min-h-12 items-center justify-between gap-6">
          <Link
            href={withLocalePrefix("/", locale)}
            aria-label="YusufDere.com home"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            {siteConfig.initials}
          </Link>
          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-5 text-xs text-foreground/80 md:flex lg:gap-7 lg:text-sm"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={withLocalePrefix(item.href, locale)}
                className="transition-opacity duration-200 hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mt-4 flex gap-5 overflow-x-auto pb-1 text-sm text-foreground/80 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={withLocalePrefix(item.href, locale)}
              className="shrink-0 transition-opacity duration-200 hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
