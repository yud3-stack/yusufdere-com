import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/dictionaries";
import { resolveIcon } from "@/lib/icons";
import { getAllNowItems } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export function generateMetadata() {
  return createMetadata({
    title: dictionary.nav.now,
    description: dictionary.pages.now.description,
    path: "/tr/now",
  });
}

export default async function TurkishNowPage() {
  const focusItems = await getAllNowItems();

  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={dictionary.pages.now.eyebrow}
        title={dictionary.pages.now.title}
        description={dictionary.pages.now.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {focusItems.length > 0 ? (
            <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr]">
              <aside className="rounded-lg border border-border bg-surface p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {dictionary.labels.lastUpdated}
                </p>
                <p className="mt-4 text-2xl font-medium text-foreground">
                  {dictionary.pages.now.lastUpdated}
                </p>
              </aside>
              <div className="grid gap-4 md:grid-cols-2">
                {focusItems.map((item) => {
                  const Icon = resolveIcon(item.icon);

                  return (
                    <article
                      key={item.title}
                      className="rounded-lg border border-border bg-surface p-6"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-5 text-muted-foreground" />
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {item.status}
                        </p>
                      </div>
                      <h2 className="mt-5 text-xl font-medium tracking-tight text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            <EmptyState
              title={dictionary.empty.now.title}
              description={dictionary.empty.now.description}
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
