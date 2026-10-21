"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function disableMeasurement(id: string, disabled: boolean) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = disabled;
}

export function Ga4Analytics({ measurementId, allowed }: { measurementId: string; allowed: boolean }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const enabled = allowed && pathname !== "/admin" && !pathname.startsWith("/admin/");

  useEffect(() => {
    disableMeasurement(measurementId, !enabled);
    if (!enabled) {
      lastPath.current = null;
      window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
      return;
    }
    window.dataLayer ??= [];
    // Keep Google's documented gtag command queue format (Arguments objects).
    // eslint-disable-next-line prefer-rest-params
    window.gtag ??= function () { window.dataLayer!.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
    return () => {
      disableMeasurement(measurementId, true);
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
    };
  }, [measurementId, enabled]);

  useEffect(() => {
    if (!enabled || lastPath.current === pathname) return;
    lastPath.current = pathname;
    // Send one explicit event per public pathname, without query strings or hashes.
    window.gtag?.("event", "page_view", {
      send_to: measurementId,
      page_location: `${window.location.origin}${pathname}`,
      page_title: document.title,
    });
  }, [enabled, measurementId, pathname]);

  return enabled ? <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" /> : null;
}
