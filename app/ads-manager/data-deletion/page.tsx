import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { dataDeletionContent } from "@/content/ads-manager-legal";
import { createMetadata } from "@/lib/seo";

const content = dataDeletionContent.en;

export const metadata: Metadata = createMetadata({
  title: content.title,
  description: content.description,
  path: "/ads-manager/data-deletion",
  locale: "en",
});

export default function AdsManagerDataDeletionPage() {
  return (
    <InteriorPage locale="en">
      <PageIntro
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />
      <LegalDocument content={content} />
    </InteriorPage>
  );
}
