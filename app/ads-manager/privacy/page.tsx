import type { Metadata } from "next";

import { LegalDocument } from "@/components/legal/legal-document";
import { InteriorPage } from "@/components/layout/interior-page";
import { PageIntro } from "@/components/layout/page-intro";
import { privacyPolicyContent } from "@/content/ads-manager-legal";
import { createMetadata } from "@/lib/seo";

const content = privacyPolicyContent.en;

export const metadata: Metadata = createMetadata({
  title: content.title,
  description: content.description,
  path: "/ads-manager/privacy",
  locale: "en",
});

export default function AdsManagerPrivacyPage() {
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
