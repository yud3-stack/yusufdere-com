import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { dataDeletionContent } from "@/content/ads-manager-legal";
import { getDictionary } from "@/dictionaries";
import { createMetadata } from "@/lib/seo";

const locale = "tr";
const dictionary = getDictionary(locale);
const content = dataDeletionContent.tr;

export const metadata: Metadata = createMetadata({
  title: content.title,
  description: content.description,
  path: "/tr/ads-manager/data-deletion",
  locale,
});

export default function TurkishAdsManagerDataDeletionPage() {
  return (
    <InteriorPage locale={locale} dictionary={dictionary}>
      <PageIntro
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <LegalDocument content={content} />
    </InteriorPage>
  );
}
