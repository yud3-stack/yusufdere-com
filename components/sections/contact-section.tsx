import Link from "next/link";
import { ArrowUpRight, AtSign, Mail } from "lucide-react";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";

export function ContactSection() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Contact
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Let&apos;s connect.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              For projects, ideas, collaborations, or quiet notes about what is
              being built next.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-white/20"
            >
              <AtSign className="size-5 text-muted-foreground" />
              <p className="mt-5 text-sm font-medium text-foreground">
                Instagram
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                {siteConfig.instagramHandle}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
            <Link
              href={`mailto:${siteConfig.email}`}
              className="group rounded-lg border border-border bg-surface p-5 transition-colors duration-200 hover:border-white/20"
            >
              <Mail className="size-5 text-muted-foreground" />
              <p className="mt-5 text-sm font-medium text-foreground">Email</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                {siteConfig.email}
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </p>
            </Link>
          </div>
        </div>
        <div className="mt-16 border-t border-border pt-6 text-sm text-muted-foreground">
          (c) 2026 Yusuf Dere. All rights reserved.
        </div>
      </Container>
    </section>
  );
}
