import Image from "next/image";
import { MapPin } from "lucide-react";

import { InitialReveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";
import type { SiteSettings } from "@/lib/sanity/types";

type HeroSectionProps = {
  siteSettings?: SiteSettings;
  locale?: Locale;
  dictionary?: Dictionary;
};

export function HeroSection({
  siteSettings,
  locale = "en",
  dictionary = getDictionary(locale),
}: HeroSectionProps) {
  const name = siteSettings?.name || siteConfig.name;
  const tagline = siteSettings?.bio || siteConfig.tagline;
  const location = siteSettings?.location || siteConfig.location;

  return (
    <section className="border-b border-border">
      <Container className="grid min-h-[90svh] min-w-0 lg:grid-cols-[0.9fr_minmax(0,1.45fr)]">
        <div className="flex min-h-[620px] min-w-0 flex-col border-border py-8 lg:border-r lg:pr-12">
          <div className="flex flex-1 items-center py-16 sm:py-20">
            <InitialReveal className="max-w-xl">
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
                {dictionary.home.heroSupport}
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Button href={withLocalePrefix("/projects", locale)}>
                  {dictionary.actions.viewProjects}
                </Button>
                <Button href={withLocalePrefix("/about", locale)} variant="secondary">
                  {dictionary.actions.aboutMe}
                </Button>
              </div>
            </InitialReveal>
          </div>
        </div>

        <div className="relative flex min-h-[520px] min-w-0 flex-col overflow-hidden lg:min-h-[90svh] lg:pl-10">
          <InitialReveal
            className="relative flex flex-1 overflow-hidden rounded-t-lg border border-border bg-[#090909] lg:rounded-none lg:border-y-0 lg:border-r-0"
            delay={0.12}
            y={22}
          >
            <Image
              src="/images/hero/yusuf-hero-cinematic.png"
              alt="Yusuf Dere overlooking a coastal city at night"
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.34),rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.28)),linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.34))]" />
          </InitialReveal>
        </div>
      </Container>
    </section>
  );
}
