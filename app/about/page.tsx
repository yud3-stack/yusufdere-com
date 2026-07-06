import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { Container } from "@/components/ui/container";
import { aboutPage } from "@/content/about";
import { getSiteSettings } from "@/lib/sanity/data";
import { createMetadata } from "@/lib/seo";

export function generateMetadata() {
  return createMetadata({
  title: "About",
  description: aboutPage.description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const siteSettings = await getSiteSettings();
  const name = siteSettings.name || "Yusuf Dere";
  const location = siteSettings.location || "Samsun, Türkiye";

  return (
    <InteriorPage>
      <PageIntro
        eyebrow={aboutPage.eyebrow}
        title={aboutPage.title}
        description={aboutPage.description}
      />
      <section className="py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {aboutPage.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-surface p-5"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-xl font-medium text-foreground">
                    {stat.label === "Base"
                      ? location.replace(", Türkiye", "")
                      : stat.label === "Mode"
                        ? "Building"
                        : stat.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-10">
              {aboutPage.sections.map((section) => (
                <article
                  key={section.title}
                  className="border-t border-border pt-8"
                >
                  <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {section.title}
                  </h2>
                  <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">
                    {section.body}
                  </p>
                </article>
              ))}
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
