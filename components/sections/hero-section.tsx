import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { siteConfig } from "@/content/site";
import type { SiteSettings } from "@/lib/sanity/types";

const navItems = [
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Journal", href: "/journal" },
  { label: "Gallery", href: "/gallery" },
  { label: "Uses", href: "/uses" },
  { label: "Now", href: "/now" },
  { label: "Contact", href: "/contact" },
] as const;

type HeroSectionProps = {
  siteSettings?: SiteSettings;
};

export function HeroSection({ siteSettings }: HeroSectionProps) {
  const name = siteSettings?.name || siteConfig.name;
  const tagline = siteSettings?.bio || siteConfig.tagline;
  const location = siteSettings?.location || siteConfig.location;

  return (
    <section className="border-b border-border">
      <Container className="grid min-h-[90svh] lg:grid-cols-[0.9fr_1.45fr]">
        <div className="flex min-h-[620px] flex-col border-border py-8 lg:border-r lg:pr-12">
          <header className="flex items-center justify-between">
            <Link
              href="/"
              aria-label="YusufDere.com home"
              className="text-lg font-semibold tracking-tight"
            >
              {siteConfig.initials}
            </Link>
            <div className="lg:hidden">
              <ThemeToggle />
            </div>
          </header>

          <div className="flex flex-1 items-center py-20">
            <div className="max-w-xl">
              <div className="mb-8 flex size-14 items-center justify-center rounded-full border border-border bg-surface text-base font-semibold">
                {siteConfig.initials}
              </div>
              <h1 className="text-5xl font-semibold tracking-tight text-foreground sm:text-6xl xl:text-7xl">
                {name}
              </h1>
              <p className="mt-5 text-xl leading-8 text-foreground sm:text-2xl">
                {tagline}
              </p>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {location}
              </p>
              <p className="mt-8 max-w-md text-base leading-7 text-muted-foreground">
                A quiet digital home for projects, notes, photography, tools,
                and the next things taking shape.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href="/projects">View Projects</Button>
                <Button href="/about" variant="secondary">
                  About Me
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-[520px] flex-col overflow-hidden lg:min-h-[90svh] lg:pl-10">
          <nav className="hidden items-center justify-between gap-6 py-8 lg:flex">
            <div className="flex items-center gap-5 text-xs text-foreground/85 xl:gap-8 xl:text-sm">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="transition-opacity duration-200 hover:opacity-60"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </nav>

          <div className="relative flex flex-1 overflow-hidden rounded-t-lg border border-border bg-[#090909] lg:rounded-none lg:border-y-0 lg:border-r-0">
            <Image
              src="/images/hero/yusuf-hero-cinematic.png"
              alt="Yusuf Dere overlooking a coastal city at night"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.34),rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.28)),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.34))]" />
          </div>
        </div>
      </Container>
    </section>
  );
}
