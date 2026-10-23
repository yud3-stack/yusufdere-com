import "server-only";
import { cache } from "react";
import { requireAdmin } from "@/lib/auth/require-admin";
import { asNumber, completeTotal, insightValue, mediaThumbnail, previousDayWindow, type InsightRow, type InsightWindow } from "./metrics";
import { getInstagramToken, InstagramApiError, instagramGet } from "./client";

export type InstagramProfile = {
  id: string;
  username: string | null;
  name: string | null;
  accountType: string | null;
  profilePictureUrl: string | null;
  followersCount: number | null;
  followsCount: number | null;
  mediaCount: number | null;
};

export type InstagramMediaItem = {
  id: string;
  caption: string | null;
  mediaType: string | null;
  mediaProductType: string | null;
  permalink: string | null;
  thumbnailUrl: string | null;
  timestamp: string | null;
  likeCount: number | null;
  commentsCount: number | null;
  insights: {
    reach: number | null;
    views: number | null;
    saved: number | null;
    shares: number | null;
  } | null;
};

export type InstagramAccountInsights = {
  reach: number | null;
  views: number | null;
  profileViews: number | null;
  accountsEngaged: number | null;
  window: InsightWindow;
  available: boolean;
  note: string | null;
};

export type InstagramReport = {
  profile: InstagramProfile;
  recentTotals: { likes: number | null; comments: number | null };
  warnings: string[];
  mediaAvailable: boolean;
  media: InstagramMediaItem[];
  insights: InstagramAccountInsights;
  fetchedAt: string;
};

export function getInstagramConnection() {
  const tokenConfigured = Boolean(getInstagramToken());
  return {
    tokenConfigured,
    ready: tokenConfigured,
  };
}

const PROFILE_FIELDS =
  "id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count";
const MEDIA_FIELDS =
  "id,caption,media_type,media_product_type,permalink,thumbnail_url,media_url,timestamp,username,comments_count,like_count";

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function mapProfile(raw: Record<string, unknown>): InstagramProfile {
  return {
    id: asString(raw.id) || asString(raw.user_id) || "",
    username: asString(raw.username),
    name: asString(raw.name),
    accountType: asString(raw.account_type),
    profilePictureUrl: asString(raw.profile_picture_url),
    followersCount: asNumber(raw.followers_count),
    followsCount: asNumber(raw.follows_count),
    mediaCount: asNumber(raw.media_count),
  };
}

function mapMedia(raw: Record<string, unknown>): InstagramMediaItem {
  return {
    id: asString(raw.id) || "",
    caption: asString(raw.caption),
    mediaType: asString(raw.media_type),
    mediaProductType: asString(raw.media_product_type),
    permalink: asString(raw.permalink),
    thumbnailUrl: mediaThumbnail(raw),
    timestamp: asString(raw.timestamp),
    likeCount: asNumber(raw.like_count),
    commentsCount: asNumber(raw.comments_count),
    insights: null,
  };
}

async function fetchProfile(): Promise<InstagramProfile> {
  try {
    const raw = await instagramGet<Record<string, unknown>>("me", { fields: PROFILE_FIELDS });
    return mapProfile(raw);
  } catch (error) {
    if (!(error instanceof InstagramApiError) || !String(error.message).toLowerCase().includes("field")) {
      throw error;
    }
    const raw = await instagramGet<Record<string, unknown>>("me", {
      fields: "id,user_id,username,account_type,media_count",
    });
    return mapProfile(raw);
  }
}

async function fetchRecentMedia(limit: number): Promise<InstagramMediaItem[]> {
  const payload = await instagramGet<{ data?: Record<string, unknown>[] }>("me/media", {
    fields: MEDIA_FIELDS,
    limit,
  });
  return (payload.data ?? []).slice(0, limit).map(mapMedia).filter(item => item.id);
}

function unsupportedMetric(error: unknown) {
  return error instanceof InstagramApiError && error.code === 100 && /metric|parameter/i.test(error.message);
}

async function fetchAccountInsights(userId: string): Promise<InstagramAccountInsights> {
  const window = previousDayWindow();
  const result: InstagramAccountInsights = {
    reach: null, views: null, profileViews: null, accountsEngaged: null,
    window, available: false, note: null,
  };
  if (!userId) return { ...result, note: "Hesap kimliği alınamadı; Insights isteği atlandı." };
  // Fetch metrics independently: an unsupported optional metric must not discard reach.
  const metrics = ["reach", "views", "profile_views", "accounts_engaged"] as const;
  const outcomes = await Promise.allSettled(metrics.map(async metric => {
    const payload = await instagramGet<{ data?: InsightRow[] }>(`${userId}/insights`, {
      metric, period: "day", metric_type: "total_value", ...window,
    });
    return insightValue(payload.data, metric, window);
  }));
  const keys = ["reach", "views", "profileViews", "accountsEngaged"] as const;
  outcomes.forEach((outcome, index) => {
    if (outcome.status === "fulfilled") result[keys[index]] = outcome.value;
  });
  result.available = keys.some(key => result[key] !== null);
  if (outcomes.some(item => item.status === "rejected") || keys.some(key => result[key] === null)) {
    result.note = "Bazı Insights metrikleri alınamadı veya bu hesap için mevcut değil. Eksik değerler — ile gösterilir; izinleri ve bağlantıyı kontrol et.";
  }
  return result;
}

async function enrichMediaInsights(items: InstagramMediaItem[]): Promise<InstagramMediaItem[]> {
  return Promise.all(items.map(async item => {
    for (const metric of ["reach,views,saved,shares", "reach,impressions,saved", "reach,saved"]) {
      try {
        const payload = await instagramGet<{ data?: InsightRow[] }>(`${item.id}/insights`, { metric });
        const insights = {
          reach: insightValue(payload.data, "reach"),
          views: insightValue(payload.data, "views") ?? insightValue(payload.data, "impressions"),
          saved: insightValue(payload.data, "saved"),
          shares: insightValue(payload.data, "shares"),
        };
        return Object.values(insights).some(value => value !== null) ? { ...item, insights } : item;
      } catch (error) {
        // Retry only unsupported metric sets, never permissions, timeouts or rate limits.
        if (!unsupportedMetric(error)) break;
      }
    }
    return item;
  }));
}

function publicErrorMessage(error: unknown): string {
  if (!(error instanceof InstagramApiError)) {
    return "Instagram raporu alınamadı. Bağlantıyı ve token’ı kontrol et.";
  }
  if (error.status === 401 || error.code === 190) {
    return "Instagram kimlik doğrulaması başarısız. Access token eksik, süresi dolmuş veya iptal edilmiş olabilir.";
  }
  if (error.status === 403 || error.code === 10 || error.code === 200) {
    return "Instagram erişimi reddedildi. Uygulama izinlerini ve hesap bağlantısını kontrol et.";
  }
  if (error.status === 429) {
    return "Instagram API kotası şu an dolu. Biraz sonra tekrar dene.";
  }
  return "Instagram raporu alınamadı. Token’ı ve Meta uygulama ayarlarını kontrol et.";
}

export type InstagramOverview = Omit<InstagramReport, "insights">;
type OverviewResult = { data: InstagramOverview | null; error: string | null };
type ReportResult = { data: InstagramReport | null; error: string | null };

// Shared per server render, with authorization checked before any Meta request.
// Overview deliberately never requests account or media Insights.
export const getInstagramOverview = cache(async (mediaLimit = 6): Promise<OverviewResult> => {
  const admin = await requireAdmin();
  if (!admin.ok) return { data: null, error: admin.error };
  if (!getInstagramConnection().ready) return { data: null, error: null };
  try {
    const profile = await fetchProfile();
    const warnings: string[] = [];
    let media: InstagramMediaItem[] = [];
    let mediaLoaded = true;
    try {
      media = await fetchRecentMedia(Math.max(1, Math.min(mediaLimit, 24)));
    } catch {
      mediaLoaded = false;
      warnings.push("Son gönderiler yüklenemedi. Profil bilgileri gösteriliyor.");
    }
    return {
      data: {
        profile, media, warnings, mediaAvailable: mediaLoaded,
        recentTotals: {
          likes: mediaLoaded ? completeTotal(media.map(item => item.likeCount)) : null,
          comments: mediaLoaded ? completeTotal(media.map(item => item.commentsCount)) : null,
        },
        fetchedAt: new Date().toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error("[Instagram report]", {
      status: error instanceof InstagramApiError ? error.status : null,
      code: error instanceof InstagramApiError ? error.code : null,
      type: "request-failed",
    });
    return { data: null, error: publicErrorMessage(error) };
  }
});

export const getInstagramReport = cache(async (mediaLimit = 12): Promise<ReportResult> => {
  const overview = await getInstagramOverview(mediaLimit);
  if (!overview.data) return { data: null, error: overview.error };
  const [insights, media] = await Promise.all([
    fetchAccountInsights(overview.data.profile.id),
    enrichMediaInsights(overview.data.media),
  ]);
  const warnings = [...overview.data.warnings];
  if (insights.note) warnings.push(insights.note);
  if (media.some(item => !item.insights)) warnings.push("Bazı gönderilerin Insights verileri alınamadı; mevcut beğeni ve yorum bilgileri korunuyor.");
  return { data: { ...overview.data, warnings, media, insights }, error: null };
});
