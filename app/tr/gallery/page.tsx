import Image from "next/image";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { getDictionary } from "@/dictionaries";
import { getAllGalleryImages } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);

export function generateMetadata() {
  return createMetadata({
    title: dictionary.nav.gallery,
    description: dictionary.pages.gallery.description,
    path: "/tr/gallery",
  });
}

export default async function TurkishGalleryPage() {
  const galleryItems = await getAllGalleryImages(locale);

  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={dictionary.pages.gallery.eyebrow}
        title={dictionary.pages.gallery.title}
        description={dictionary.pages.gallery.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          {galleryItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {galleryItems.map((item, index) => (
                <article
                  key={`${item.title}-${item.location}`}
                  className="overflow-hidden rounded-lg border border-border bg-surface"
                >
                  <div className="relative aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_30%),linear-gradient(140deg,#1b1b1d,#080808)]">
                    {"imageUrl" in item && item.imageUrl ? (
                      <>
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                      </>
                    ) : (
                      <div className="flex h-full items-end p-5">
                        <div
                          className="h-px flex-1 bg-white/15"
                          style={{ marginBottom: `${12 + index * 5}%` }}
                        />
                      </div>
                    )}
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
          ) : (
            <EmptyState
              title={dictionary.empty.gallery.title}
              description={dictionary.empty.gallery.description}
            />
          )}
        </Container>
      </section>
    </InteriorPage>
  );
}
