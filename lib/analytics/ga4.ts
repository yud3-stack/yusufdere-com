import "server-only";
import { cache } from "react";
import { JWT } from "google-auth-library";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAnalyticsConfig } from "@/lib/cookies/analytics";
import { getSiteUrl } from "@/lib/site";
import { buildAnalyticsRequests, parseAnalyticsResponse, type AnalyticsPeriod, type AnalyticsReport } from "./report";

export function getGa4Connection() {
  const tracking = getAnalyticsConfig();
  const propertyId = process.env.GA4_PROPERTY_ID?.trim() ?? "";
  const email = process.env.GA4_CLIENT_EMAIL?.trim() ?? "";
  const key = process.env.GA4_PRIVATE_KEY?.trim() ?? "";
  return {
    trackingConfigured: tracking?.provider === "ga4",
    propertyConfigured: /^\d+$/.test(propertyId),
    credentialsConfigured: Boolean(email && key),
    ready: /^\d+$/.test(propertyId) && Boolean(email && key),
  };
}

type AnalyticsResult = { data: AnalyticsReport | null; error: string | null };

export const getGa4Report = cache(async (period: AnalyticsPeriod): Promise<AnalyticsResult> => {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: null, error: admin.error };
  if (!getGa4Connection().ready) return { data: null, error: null };

  try {
    const auth = new JWT({
      email: process.env.GA4_CLIENT_EMAIL!.trim(),
      key: process.env.GA4_PRIVATE_KEY!.trim().replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });
    const propertyId = process.env.GA4_PROPERTY_ID!.trim();
    const response = await auth.request<unknown>({
      url: `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:batchRunReports`,
      method: "POST",
      data: { requests: buildAnalyticsRequests(period, new URL(getSiteUrl()).hostname) },
      timeout: 10000,
      retry: false,
    });
    return { data: parseAnalyticsResponse(response.data), error: null };
  } catch (error) {
    // Never send Google's error payload, request headers or credentials to the browser.
    const status = typeof error === "object" && error && "response" in error
      ? (error.response as { status?: number } | undefined)?.status : undefined;
    const message = status === 403 ? "GA4 erişimi reddedildi. Data API’nin açık olduğunu ve hizmet hesabının mülkte Görüntüleyici yetkisi bulunduğunu kontrol et."
      : status === 401 ? "GA4 kimlik doğrulaması başarısız. Hizmet hesabı bilgilerini kontrol et."
      : status === 429 ? "GA4 sorgu kotası şu an dolu. Biraz sonra tekrar dene."
      : "GA4 raporu alınamadı. Bağlantıyı, mülk kimliğini ve hizmet hesabını kontrol et.";
    return { data: null, error: message };
  }
});
