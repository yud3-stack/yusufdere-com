import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { homeIntro } from "@/content/home";

export function AboutPreviewSection() {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            {homeIntro.eyebrow}
          </p>
          <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
            <h2 className="max-w-xl text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              {homeIntro.title}
            </h2>
            <div>
              <p className="text-base leading-8 text-muted-foreground">
                {homeIntro.body}
              </p>
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
