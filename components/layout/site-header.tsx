import Link from "next/link";

import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/content/site";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/journal" },
  { label: "Gallery", href: "/gallery" },
  { label: "Uses", href: "/uses" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <Container className="py-4">
        <div className="flex min-h-12 items-center justify-between gap-6">
          <Link
            href="/"
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
                href={item.href}
                className="transition-opacity duration-200 hover:opacity-60"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
        <nav
          aria-label="Mobile navigation"
          className="mt-4 flex gap-5 overflow-x-auto pb-1 text-sm text-foreground/80 md:hidden"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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
