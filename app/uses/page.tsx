import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  usesPage,
  type UsesCategory,
} from "@/content/uses";
import { getAllUsesItems } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
  title: "Uses",
  description: usesPage.description,
    path: "/uses",
  });
}

const categories: UsesCategory[] = [
  "Hardware",
  "Software",
  "Apps",
  "Everyday Carry",
];

export default async function UsesPage() {
  const usesItems = await getAllUsesItems();

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={usesPage.eyebrow}
        title={usesPage.title}
        description={usesPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {usesItems.length > 0 ? (
            <div className="space-y-12">
              {categories.map((category) => {
                const items = usesItems.filter((item) => item.category === category);

                if (items.length === 0) {
                  return null;
                }

                return (
                  <section key={category} className="border-t border-border pt-8">
                    <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                      {category}
                    </h2>
                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      {items.map((item) => (
                        <article
                          key={item.title}
                          className="rounded-lg border border-border bg-surface p-6"
                        >
                          <h3 className="text-lg font-medium text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Setup is being curated."
              description="Tools, devices and everyday workflow items will be listed here soon."
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
