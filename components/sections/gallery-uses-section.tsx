import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  type GalleryPreview,
  type UsesItem,
} from "@/content/home";
import { getDictionary, type Dictionary } from "@/dictionaries";
import { resolveIcon } from "@/lib/icons";
import type { Locale } from "@/lib/locale";
import { withLocalePrefix } from "@/lib/locale";

type GalleryUsesSectionProps = {
  galleryItems?: GalleryPreview[];
  usesItems?: UsesItem[];
  locale?: Locale;
  dictionary?: Dictionary;
};

export function GalleryUsesSection({
  galleryItems = [],
  usesItems = [],
  locale = "en",
  dictionary = getDictionary(locale),
}: GalleryUsesSectionProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
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
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {galleryItems.map((item, index) => (
                  <article
                    key={item.title}
                    className="group overflow-hidden rounded-lg border border-border bg-surface"
                  >
                    <div className="aspect-[4/5] bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0)_34%),linear-gradient(145deg,#1c1c1f,#080808)]">
                      <div className="flex h-full items-end p-4">
                        <div
                          className="h-px flex-1 bg-white/15"
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
                ))}
              </div>
            ) : (
              <EmptyState
                className="mt-8 py-10"
                title={dictionary.empty.gallery.title}
                description={dictionary.empty.gallery.description}
              />
            )}
          </div>

          <div className="lg:border-l lg:border-border lg:pl-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                {dictionary.nav.uses}
              </h2>
              <Link
                href={withLocalePrefix("/uses", locale)}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {dictionary.actions.viewFullList}
                <ArrowRight className="size-4" />
              </Link>
            </div>
            {usesItems.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
                {usesItems.map((item) => {
                  const Icon = resolveIcon(item.icon);

                  return (
                    <article key={item.title}>
                      <Icon className="size-6 text-muted-foreground" />
                      <h3 className="mt-4 text-sm font-medium text-foreground">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                className="mt-8 py-10"
                title={dictionary.empty.uses.title}
                description={dictionary.empty.uses.description}
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
