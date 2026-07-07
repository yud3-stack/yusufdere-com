import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { homeIntro } from "@/content/home";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";
import type { AboutPageContent } from "@/lib/sanity/data";
import { cn } from "@/lib/utils/cn";

type AboutPreviewSectionProps = {
  aboutPage?: AboutPageContent;
  locale?: Locale;
  dictionary?: Dictionary;
};

export function AboutPreviewSection({
  aboutPage,
  locale = "en",
  dictionary = getDictionary(locale),
}: AboutPreviewSectionProps) {
  const title = aboutPage?.title || homeIntro.title;
  const intro = aboutPage?.intro || homeIntro.body;
  const currentFocus = aboutPage?.currentFocus || homeIntro.body;
  const eyebrow = aboutPage?.eyebrow || dictionary.nav.about;
  const focusAreas = aboutPage?.focusAreas || [];
  const hasImage = Boolean(aboutPage?.imageUrl);
  const showCurrentFocus = Boolean(currentFocus && currentFocus !== intro);

  return (
    <section className="border-b border-border py-16 sm:py-20">
      <Container>
        <Reveal
          className={cn(
            "grid gap-8 md:gap-10 lg:items-start",
            hasImage
              ? "lg:grid-cols-[1fr_1fr_1.05fr]"
              : "lg:grid-cols-[0.85fr_1.15fr]",
          )}
        >
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
          </div>

          <div className="space-y-5 lg:pt-10">
            <p className="text-base leading-8 text-muted-foreground">{intro}</p>
            {showCurrentFocus ? (
              <p className="border-l border-border pl-5 text-sm leading-7 text-muted-foreground">
                {currentFocus}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 pt-1">
              {focusAreas.slice(0, 4).map((area) => (
                <Badge key={area}>{area}</Badge>
              ))}
              <Link
                href={withLocalePrefix(homeIntro.href, locale)}
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity duration-200 hover:opacity-70"
              >
                {dictionary.home.aboutLink}
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>

          {aboutPage?.imageUrl ? (
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-white/20">
              <Image
                src={aboutPage.imageUrl}
                alt={title}
                fill
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
