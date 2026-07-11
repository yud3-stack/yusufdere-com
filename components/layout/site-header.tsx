import Link from "next/link";

import { CommandMenuTrigger } from "@/components/command/command-menu-trigger";
import { SiteHeaderShell } from "@/components/layout/site-header-shell";
import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type SiteHeaderProps = {
  locale?: Locale;
  dictionary?: Dictionary;
  variant?: "home" | "inner";
};

export function SiteHeader({
  locale = "en",
  dictionary = getDictionary(locale),
  variant = "inner",
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

  if (variant === "home") {
    return (
      <header className="relative z-40 bg-background">
        <Container className="py-5 sm:py-6">
          <div className="grid min-h-10 min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4">
            <Link
              href={withLocalePrefix("/", locale)}
              aria-label="YusufDere.com home"
              className="inline-flex shrink-0 items-center transition-opacity duration-200 hover:opacity-70"
            >
              <Logo size="md" alt="Yusuf Dere" />
            </Link>
            <nav
              aria-label="Primary navigation"
              className="hidden min-w-0 justify-center gap-4 overflow-x-auto px-3 text-xs text-foreground/78 [scrollbar-width:none] lg:flex xl:gap-6 xl:text-sm [&::-webkit-scrollbar]:hidden"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={withLocalePrefix(item.href, locale)}
                  className="shrink-0 transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex shrink-0 items-center justify-end gap-2">
              <CommandMenuTrigger
                label={dictionary.command.trigger}
                shortcutLabel={dictionary.command.shortcut}
              />
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </Container>
      </header>
    );
  }

  return (
    <SiteHeaderShell>
      <Container className="py-3.5">
        <div className="flex min-h-12 min-w-0 items-center justify-between gap-3 sm:gap-4">
          <Link
            href={withLocalePrefix("/", locale)}
            aria-label="YusufDere.com home"
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-background/35 transition-colors duration-200 hover:border-foreground/20 hover:bg-surface"
          >
            <Logo size="sm" alt="Yusuf Dere" />
          </Link>
          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-full border border-border bg-background/30 p-1 text-xs text-foreground/76 [scrollbar-width:none] lg:flex [&::-webkit-scrollbar]:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={withLocalePrefix(item.href, locale)}
                className="shrink-0 rounded-full px-2.5 py-2 transition-colors duration-200 hover:bg-surface hover:text-foreground xl:px-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <CommandMenuTrigger
              label={dictionary.command.trigger}
              shortcutLabel={dictionary.command.shortcut}
            />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1 text-sm text-foreground/80 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={withLocalePrefix(item.href, locale)}
              className="shrink-0 rounded-full border border-border bg-background/30 px-3 py-2 transition-colors duration-200 hover:bg-surface hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </SiteHeaderShell>
  );
}
