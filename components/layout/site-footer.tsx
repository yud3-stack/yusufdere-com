import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/content/site";
import { getStudioContent, studioUrl } from "@/content/studio";
import { getDictionary, type Dictionary } from "@/dictionaries";

type SiteFooterProps = {
  dictionary?: Dictionary;
};

export function SiteFooter({ dictionary = getDictionary("en") }: SiteFooterProps) {
  const studio = getStudioContent(dictionary.locale === "tr" ? "tr" : "en");

  return (
    <footer className="border-t border-border py-8">
      <Container className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          (c) 2026 {siteConfig.name}. {dictionary.footer.rights}
        </p>
        <div className="flex flex-wrap gap-5">
          <Link
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200 hover:text-foreground"
          >
            {siteConfig.instagramHandle}
          </Link>
          <Link
            href={`mailto:${siteConfig.email}`}
            className="transition-colors duration-200 hover:text-foreground"
          >
            {siteConfig.email}
          </Link>
          <Link
            href={studioUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-200 hover:text-foreground"
          >
            {studio.title}
          </Link>
        </div>
      </Container>
    </footer>
  );
}
