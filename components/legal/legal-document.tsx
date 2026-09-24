import Link from "next/link";

import { Container } from "@/components/ui/container";
import type { LegalDocumentContent } from "@/content/ads-manager-legal";

type LegalDocumentProps = {
  content: LegalDocumentContent;
};

export function LegalDocument({ content }: LegalDocumentProps) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.32fr)_minmax(0,0.68fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
              <p className="text-sm font-semibold text-foreground">
                {content.appName}
              </p>
              <dl className="mt-8 space-y-6 text-sm">
                <div>
                  <dt className="text-muted-foreground">
                    {content.effectiveDateLabel}
                  </dt>
                  <dd className="mt-1 text-foreground">{content.effectiveDate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">{content.contactLabel}</dt>
                  <dd className="mt-1 break-all">
                    <Link
                      href={`mailto:${content.contactEmail}`}
                      className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                    >
                      {content.contactEmail}
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>
          </aside>

          <div>
            {content.sections.map((section) => (
              <article
                key={section.title}
                className="border-t border-border py-9 first:border-t-0 first:pt-0"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-5 text-base leading-8 text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items ? (
                  <ul className="mt-5 space-y-3 pl-5 text-base leading-8 text-muted-foreground marker:text-foreground">
                    {section.items.map((item) => (
                      <li key={item} className="list-disc pl-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
