import Link from "next/link";
import { ArrowUpRight, AtSign, Mail } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { getStudioContent, studioUrl } from "@/content/studio";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { SiteSettings } from "@/lib/sanity/types";

type ContactSectionProps = {
  siteSettings?: SiteSettings;
  dictionary?: Dictionary;
};

export function ContactSection({
  siteSettings,
  dictionary = getDictionary("en"),
}: ContactSectionProps) {
  const instagramUrl = siteSettings?.instagramUrl || siteConfig.instagramUrl;
  const email = siteSettings?.email || siteConfig.email;
  const studio = getStudioContent(dictionary.locale === "tr" ? "tr" : "en");

  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-end">
          <Reveal>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {dictionary.nav.contact}
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              {dictionary.pages.contact.homeTitle}
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              {dictionary.pages.contact.homeDescription}
            </p>
          </Reveal>

          <Stagger className="grid gap-4 sm:grid-cols-2">
            <StaggerItem>
              <Link
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="group block h-full rounded-lg border border-border bg-surface p-5 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface-muted/70"
              >
                <AtSign className="size-5 text-muted-foreground" />
                <p className="mt-5 text-sm font-medium text-foreground">
                  {dictionary.labels.instagram}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {siteConfig.instagramHandle}
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </Link>
            </StaggerItem>
            <StaggerItem>
              <Link
                href={`mailto:${email}`}
                className="group block h-full rounded-lg border border-border bg-surface p-5 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface-muted/70"
              >
                <Mail className="size-5 text-muted-foreground" />
                <p className="mt-5 text-sm font-medium text-foreground">
                  {dictionary.labels.email}
                </p>
                <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {email}
                  <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </p>
              </Link>
            </StaggerItem>
          </Stagger>
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 Yusuf Dere. {dictionary.footer.rights}</p>
          <Link
            href={studioUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-foreground"
          >
            {studio.action}
            <ArrowUpRight className="size-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
