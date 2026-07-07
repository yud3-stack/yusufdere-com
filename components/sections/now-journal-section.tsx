import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  type JournalPreview,
  type NowItem,
} from "@/content/home";
import { getDictionary, type Dictionary } from "@/dictionaries";
import { resolveIcon } from "@/lib/icons";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type NowJournalSectionProps = {
  nowItems?: NowItem[];
  journalPosts?: JournalPreview[];
  locale?: Locale;
  dictionary?: Dictionary;
};

export function NowJournalSection({
  nowItems = [],
  journalPosts = [],
  locale = "en",
  dictionary = getDictionary(locale),
}: NowJournalSectionProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <Reveal className="grid gap-12 lg:grid-cols-2 lg:gap-0">
          <div className="lg:border-r lg:border-border lg:pr-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                {dictionary.nav.now}
              </h2>
              <Link
                href={withLocalePrefix("/now", locale)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {dictionary.actions.moreUpdates}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            {nowItems.length > 0 ? (
              <Stagger className="mt-8 space-y-6">
                {nowItems.map((item) => {
                  const Icon = resolveIcon(item.icon);

                  return (
                    <StaggerItem key={item.title} className="h-auto">
                      <article className="flex gap-4 transition-opacity duration-200 hover:opacity-80">
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
                    </StaggerItem>
                  );
                })}
              </Stagger>
            ) : (
              <EmptyState
                className="mt-8 py-10 text-left"
                title={dictionary.empty.now.title}
                description={dictionary.empty.now.description}
              />
            )}
          </div>

          <div className="lg:pl-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                {dictionary.nav.journal}
              </h2>
              <Link
                href={withLocalePrefix("/journal", locale)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {dictionary.actions.viewAllPosts}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            {journalPosts.length > 0 ? (
              <Stagger className="mt-6 divide-y divide-border">
                {journalPosts.map((post) => (
                  <StaggerItem key={post.title} className="h-auto">
                    <Link
                      href={withLocalePrefix(post.href, locale)}
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
                  </StaggerItem>
                ))}
              </Stagger>
            ) : (
              <EmptyState
                className="mt-8 py-10 text-left"
                title={dictionary.empty.journal.title}
                description={dictionary.empty.journal.description}
              />
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
