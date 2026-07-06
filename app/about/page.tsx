import Image from "next/image";

import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { getAboutPage, getSiteSettings } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const aboutPage = await getAboutPage("en");

  return createMetadata({
    title: aboutPage.title || "About",
    description: aboutPage.intro,
    path: "/about",
  });
}

export default async function AboutPage() {
  const [aboutPage, siteSettings] = await Promise.all([
    getAboutPage("en"),
    getSiteSettings("en"),
  ]);
  const name = siteSettings.name || "Yusuf Dere";
  const location = aboutPage.location || siteSettings.location || "Samsun, Turkiye";
  const focusAreas = aboutPage.focusAreas;

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        description={aboutPage.intro}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <aside className="space-y-5">
              {aboutPage.imageUrl ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-border bg-surface">
                  <Image
                    src={aboutPage.imageUrl}
                    alt={aboutPage.title}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : null}
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Base
                  </p>
                  <p className="mt-3 text-xl font-medium text-foreground">
                    {location.split(",")[0]}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Focus
                  </p>
                  <p className="mt-3 text-xl font-medium text-foreground">
                    {focusAreas[0] || "Products"}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Mode
                  </p>
                  <p className="mt-3 text-xl font-medium text-foreground">
                    Building
                  </p>
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              <article className="border-t border-border pt-8">
                <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  The direction
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                  {aboutPage.intro}
                </p>
                {focusAreas.length > 0 ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {focusAreas.map((area) => (
                      <Badge key={area}>{area}</Badge>
                    ))}
                  </div>
                ) : null}
              </article>

              {aboutPage.body.length > 0 ? (
                <article className="border-t border-border pt-8">
                  <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Story
                  </h2>
                  <div className="mt-5 max-w-3xl space-y-6 text-base leading-8 text-muted-foreground">
                    {aboutPage.body.map((paragraph, index) => (
                      <p key={`${index}-${paragraph}`}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              ) : null}

              {aboutPage.currentFocus ? (
                <article className="border-t border-border pt-8">
                  <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Current focus
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                    {aboutPage.currentFocus}
                  </p>
                </article>
              ) : null}
            </div>
          </div>
          <p className="mt-14 max-w-3xl border-t border-border pt-8 text-base leading-8 text-muted-foreground">
            This is the home of {name}: a personal brand system for connecting
            product work, journal notes, photography, current focus, and the
            future experiments that start in {location}.
          </p>
        </Container>
      </section>
    </InteriorPage>
  );
}
