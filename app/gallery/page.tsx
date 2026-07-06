import type { Metadata } from "next";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { galleryItems, galleryPage } from "@/content/gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description: galleryPage.description,
};

export default function GalleryPage() {
  return (
    <InteriorPage>
      <PageIntro
        eyebrow={galleryPage.eyebrow}
        title={galleryPage.title}
        description={galleryPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item, index) => (
              <article
                key={`${item.title}-${item.location}`}
                className="overflow-hidden rounded-lg border border-border bg-surface"
              >
                <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_30%),linear-gradient(140deg,#1b1b1d,#080808)]">
                  <div className="flex h-full items-end p-5">
                    <div
                      className="h-px flex-1 bg-white/15"
                      style={{ marginBottom: `${12 + index * 5}%` }}
                    />
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h2 className="mt-4 text-lg font-medium text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.location}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </InteriorPage>
  );
}
