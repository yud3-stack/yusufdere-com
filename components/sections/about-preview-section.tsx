import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { homeIntro } from "@/content/home";
import type { AboutPageContent } from "@/lib/sanity/data";

type AboutPreviewSectionProps = {
  aboutPage?: AboutPageContent;
};

export function AboutPreviewSection({ aboutPage }: AboutPreviewSectionProps) {
  const title = aboutPage?.title || homeIntro.title;
  const intro = aboutPage?.intro || homeIntro.body;
  const currentFocus = aboutPage?.currentFocus || homeIntro.body;
  const eyebrow = aboutPage?.eyebrow || homeIntro.eyebrow;
  const focusAreas = aboutPage?.focusAreas || [];

  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {eyebrow}
          </p>
          <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            <div>
              <p className="text-base leading-8 text-muted-foreground">
                {intro}
              </p>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                {currentFocus}
              </p>
              {focusAreas.length > 0 ? (
                <div className="mt-6 flex flex-wrap gap-2">
                  {focusAreas.slice(0, 4).map((area) => (
                    <Badge key={area}>{area}</Badge>
                  ))}
                </div>
              ) : null}
              {aboutPage?.imageUrl ? (
                <div className="relative mt-8 aspect-[16/10] overflow-hidden rounded-lg border border-border bg-surface">
                  <Image
                    src={aboutPage.imageUrl}
                    alt={title}
                    fill
                    sizes="(min-width: 768px) 36vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : null}
              <Link
                href={homeIntro.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-foreground transition-opacity duration-200 hover:opacity-70"
              >
                About
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
