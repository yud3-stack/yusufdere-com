import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { foundationNotes } from "@/content/foundation";
import { siteConfig } from "@/content/site";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Container className="flex min-h-screen flex-col py-8 sm:py-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold tracking-tight">
              {siteConfig.initials}
            </div>
            <div>
              <p className="text-sm font-medium">{siteConfig.name}</p>
              <p className="text-xs text-muted-foreground">
                {siteConfig.location}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        <section className="flex flex-1 items-center py-24 sm:py-32">
          <div className="max-w-4xl">
            <Badge>Foundation</Badge>
            <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              {siteConfig.name}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-muted-foreground sm:text-2xl sm:leading-9">
              {siteConfig.tagline}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button href={siteConfig.primaryAction.href}>
                {siteConfig.primaryAction.label}
              </Button>
              <Button
                href={siteConfig.instagramUrl}
                variant="secondary"
                target="_blank"
                rel="noreferrer"
              >
                {siteConfig.instagramHandle}
              </Button>
            </div>
          </div>
        </section>

        <section id="foundation" className="pb-16">
          <SectionHeader
            eyebrow="System"
            title="Prepared for a premium personal hub."
            description="This is a clean starting point for the real homepage, CMS schema, and section work that follows."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {foundationNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h2 className="text-base font-medium text-foreground">
                  {note.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {note.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </Container>
    </main>
  );
}
