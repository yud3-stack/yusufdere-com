import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/dictionaries";
import { withLocalePrefix } from "@/lib/locale";
import { getAllJournalPosts } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export function generateMetadata() {
  return createMetadata({
    title: dictionary.nav.journal,
    description: dictionary.pages.journal.description,
    path: "/tr/journal",
  });
}

export default async function TurkishJournalPage() {
  const journalEntries = await getAllJournalPosts();

  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={dictionary.pages.journal.eyebrow}
        title={dictionary.pages.journal.title}
        description={dictionary.pages.journal.description}
      />
      <section className="py-12 sm:py-16">
        <Container>
          {journalEntries.length > 0 ? (
            <div className="divide-y divide-border border-y border-border">
              {journalEntries.map((entry) => (
                <Link
                  key={entry.title}
                  href={withLocalePrefix(entry.href, locale)}
                  className="grid gap-5 py-8 transition-opacity duration-200 hover:opacity-70 lg:grid-cols-[0.28fr_1fr_auto]"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {entry.category}
                    </p>
                    <time className="mt-3 block text-sm text-muted-foreground">
                      {entry.date}
                    </time>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                      {entry.title}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {entry.excerpt}
                    </p>
                  </div>
                  <ArrowUpRight className="size-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title={dictionary.empty.journal.title}
              description={dictionary.empty.journal.description}
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
