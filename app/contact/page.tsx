import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, AtSign, Mail } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { getSiteSettings } from "@/lib/sanity/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Yusuf Dere through Instagram or email for projects, ideas, and collaborations.",
};

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const instagramUrl = siteSettings.instagramUrl || siteConfig.instagramUrl;
  const email = siteSettings.email || siteConfig.email;

  return (
    <InteriorPage>
      <PageIntro
        eyebrow="Contact"
        title="A simple way to reach out."
        description="For product ideas, collaborations, thoughtful notes, or anything connected to what Yusuf is building next."
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-5 md:grid-cols-2">
            <Link
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-border bg-surface p-7 transition-colors duration-200 hover:border-white/20"
            >
              <AtSign className="size-6 text-muted-foreground" />
              <h2 className="mt-8 text-2xl font-medium tracking-tight text-foreground">
                Instagram
              </h2>
              <p className="mt-3 flex items-center gap-2 text-muted-foreground">
                {siteConfig.instagramHandle}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
            <Link
              href={`mailto:${email}`}
              className="group rounded-lg border border-border bg-surface p-7 transition-colors duration-200 hover:border-white/20"
            >
              <Mail className="size-6 text-muted-foreground" />
              <h2 className="mt-8 text-2xl font-medium tracking-tight text-foreground">
                Email
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
