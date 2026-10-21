"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getAnalyticsConfig } from "@/lib/cookies/analytics";
import { Ga4Analytics } from "@/components/cookies/Ga4Analytics";
import {
  getAnalyticsConsentServerSnapshot,
  hasAnalyticsConsent,
  subscribeConsent,
} from "@/lib/cookies/consent";

function useAnalyticsAllowed() {
  return useSyncExternalStore(
    subscribeConsent,
    hasAnalyticsConsent,
    getAnalyticsConsentServerSnapshot,
  );
}

export function Analytics() {
  const allowed = useAnalyticsAllowed();
  const config = getAnalyticsConfig();

  if (!config) return null;
  if (config.provider === "ga4") return <Ga4Analytics measurementId={config.measurementId} allowed={allowed} />;
  if (!allowed) return null;

  if (config.provider === "plausible") {
    return (
      <Script
        defer
        data-domain={config.domain}
        src={config.src}
        strategy="afterInteractive"
      />
    );
  }

  if (config.provider === "umami") {
    return (
      <Script
        defer
        data-website-id={config.websiteId}
        src={config.src}
        strategy="afterInteractive"
      />
    );
  }

  return null;
}
