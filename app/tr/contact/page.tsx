import Link from "next/link";
import { ArrowUpRight, AtSign, Mail } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { getDictionary } from "@/dictionaries";
import { getSiteSettings } from "@/lib/sanity/data";
import { createMetadata, localizedSeo } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export function generateMetadata() {
  return createMetadata({
    title: dictionary.nav.contact,
    description: localizedSeo.tr.contactDescription,
    path: "/tr/contact",
    locale,
  });
}

export default async function TurkishContactPage() {
  const siteSettings = await getSiteSettings(locale);
  const instagramUrl = siteSettings.instagramUrl || siteConfig.instagramUrl;
  const email = siteSettings.email || siteConfig.email;

  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={dictionary.pages.contact.eyebrow}
        title={dictionary.pages.contact.title}
        description={dictionary.pages.contact.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-border bg-surface p-7 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface-muted/70"
            >
              <AtSign className="size-6 text-muted-foreground" />
              <h2 className="mt-8 text-2xl font-medium tracking-tight text-foreground">
                {dictionary.labels.instagram}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                {siteConfig.instagramHandle}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
            <Link
              href={`mailto:${email}`}
              className="group rounded-lg border border-border bg-surface p-7 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface-muted/70"
            >
              <Mail className="size-6 text-muted-foreground" />
              <h2 className="mt-8 text-2xl font-medium tracking-tight text-foreground">
                {dictionary.labels.email}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                {email}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
