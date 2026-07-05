import type { ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Code2, Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { journalPreviews, nowItems, type NowItem } from "@/content/home";

const nowIcons: Record<NowItem["icon"], ComponentType<{ className?: string }>> =
  {
    book: BookOpen,
    code: Code2,
    spark: Sparkles,
  };

export function NowJournalSection() {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-0">
          <div className="lg:border-r lg:border-border lg:pr-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                Now
              </h2>
              <Link
                href="/now"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                More updates
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-8 space-y-6">
              {nowItems.map((item) => {
                const Icon = nowIcons[item.icon];

                return (
                  <article key={item.title} className="flex gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface text-muted-foreground">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="lg:pl-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                Journal
              </h2>
              <Link
                href="/journal"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                View all posts
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-6 divide-y divide-border">
              {journalPreviews.map((post) => (
                <Link
                  key={post.title}
                  href={post.href}
                  className="grid gap-4 py-6 transition-opacity duration-200 hover:opacity-70 sm:grid-cols-[1fr_auto]"
                >
                  <div>
                    <h3 className="text-base font-medium text-foreground">
                      {post.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>
                  <time className="text-sm text-muted-foreground">
                    {post.date}
                  </time>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
