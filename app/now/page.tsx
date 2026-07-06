import type { Metadata } from "next";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { focusItems, nowPage } from "@/content/now";

export const metadata: Metadata = {
  title: "Now",
  description: nowPage.description,
};

export default function NowPage() {
  return (
    <InteriorPage>
      <PageIntro
        eyebrow={nowPage.eyebrow}
        title={nowPage.title}
        description={nowPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.35fr_1fr]">
            <aside className="rounded-lg border border-border bg-surface p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Last updated
              </p>
              <p className="mt-4 text-2xl font-medium text-foreground">
                {nowPage.lastUpdated}
              </p>
            </aside>
            <div className="grid gap-4 md:grid-cols-2">
              {focusItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-lg border border-border bg-surface p-6"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.status}
                  </p>
                  <h2 className="mt-5 text-xl font-medium tracking-tight text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
