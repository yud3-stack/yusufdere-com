import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { journalPage } from "@/content/journal";
import { getAllJournalPosts } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
  title: "Journal",
  description: journalPage.description,
    path: "/journal",
  });
}

export default async function JournalPage() {
  const journalEntries = await getAllJournalPosts();

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={journalPage.eyebrow}
        title={journalPage.title}
        description={journalPage.description}
      />
      <section className="py-12 sm:py-16">
        <Container>
          {journalEntries.length > 0 ? (
            <div className="divide-y divide-border border-y border-border">
              {journalEntries.map((entry) => (
                <Link
                  key={entry.title}
                  href={entry.href}
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
              title="Notes will be published soon."
              description="Short thoughts, development logs and behind-the-scenes notes will live here."
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
