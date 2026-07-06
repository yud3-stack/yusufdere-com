import type { ComponentType } from "react";
import Link from "next/link";
import {
  AppWindow,
  ArrowRight,
  Camera,
  Code2,
  Headphones,
  Laptop,
  Smartphone,
} from "lucide-react";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import {
  type GalleryPreview,
  type UsesItem,
} from "@/content/home";

const usesIcons: Record<UsesItem["icon"], ComponentType<{ className?: string }>> =
  {
    app: AppWindow,
    camera: Camera,
    code: Code2,
    headphones: Headphones,
    laptop: Laptop,
    phone: Smartphone,
  };

type GalleryUsesSectionProps = {
  galleryItems?: GalleryPreview[];
  usesItems?: UsesItem[];
};

export function GalleryUsesSection({
  galleryItems = [],
  usesItems = [],
}: GalleryUsesSectionProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div>
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                Gallery
              </h2>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                View all photos
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
                title="Gallery is not live yet."
                description="Lifestyle, travel, workspace and photography selections will be added soon."
              />
            )}
          </div>

          <div className="lg:border-l lg:border-border lg:pl-12">
            <div className="flex items-center justify-between gap-6">
              <h2 className="text-sm font-medium uppercase tracking-[0.24em] text-foreground">
                Uses
              </h2>
              <Link
                href="/uses"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                View full list
                <ArrowRight className="size-4" />
              </Link>
            </div>
            {usesItems.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
                {usesItems.map((item) => {
                  const Icon = usesIcons[item.icon];

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
                title="Setup is being curated."
                description="Tools, devices and everyday workflow items will be listed here soon."
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
