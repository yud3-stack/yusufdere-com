import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import type { GalleryPreview } from "@/content/home";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type GallerySectionProps = {
  galleryItems?: GalleryPreview[];
  locale?: Locale;
  dictionary?: Dictionary;
};

export function GallerySection({
  galleryItems = [],
  locale = "en",
  dictionary = getDictionary(locale),
}: GallerySectionProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <Reveal>
          <div className="flex items-center justify-between gap-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
              {dictionary.nav.gallery}
            </h2>
            <Link
              href={withLocalePrefix("/gallery", locale)}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {dictionary.actions.viewAllPhotos}
              <ArrowRight className="size-4" />
            </Link>
          </div>

          {galleryItems.length > 0 ? (
            <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {galleryItems.map((item, index) => (
                <StaggerItem key={`${item.title}-${item.location}`}>
                  <article className="group h-full overflow-hidden rounded-lg border border-border bg-surface transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-surface-muted/70">
                    <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_34%),linear-gradient(145deg,#1c1c1f,#080808)]">
                      <div className="flex h-full items-end p-4">
                        <div
                          className="h-px flex-1 bg-white/15 transition-transform duration-300 group-hover:scale-x-95"
                          style={{ marginBottom: `${16 + index * 9}%` }}
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.location}
                      </p>
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState
              className="mt-8 py-10"
              title={dictionary.empty.gallery.title}
              description={dictionary.empty.gallery.description}
            />
          )}
        </Reveal>
      </Container>
    </section>
  );
}
