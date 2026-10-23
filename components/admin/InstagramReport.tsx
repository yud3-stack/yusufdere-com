import { ArrowUpRight, Heart, MessageCircle, Bookmark, Eye, Share2 } from "lucide-react";
import type { InstagramMediaItem, InstagramReport } from "@/lib/instagram/report";
import { completeTotal, formatCount } from "@/lib/instagram/metrics";
import { formatDate } from "@/lib/format";

function captionPreview(caption: string | null) {
  if (!caption?.trim()) return "Başlıksız gönderi";
  const trimmed = caption.trim().replace(/\s+/g, " ");
  return trimmed.length > 110 ? `${trimmed.slice(0, 107)}…` : trimmed;
}

function mediaLabel(item: InstagramMediaItem) {
  const product = item.mediaProductType?.toUpperCase();
  if (product === "REELS") return "Reel";
  if (product === "STORY") return "Story";
  if (item.mediaType === "CAROUSEL_ALBUM") return "Carousel";
  if (item.mediaType === "VIDEO") return "Video";
  return "Gönderi";
}

export function InstagramMetrics({ report }: { report: InstagramReport | null }) {
  const metrics = [
    { label: "Takipçi", value: report?.profile.followersCount, note: "Anlık hesap değeri" },
    { label: "Gönderi", value: report?.profile.mediaCount, note: "Toplam yayınlanan medya" },
    {
      label: "Erişim",
      value: report?.insights.available ? report.insights.reach : null,
      note: report?.insights.available ? `${new Date(report.insights.window.since * 1000).toLocaleDateString("tr-TR", { timeZone: "UTC" })} · UTC` : "Insights verisi alınamadı",
    },
    {
      label: "Son gönderiler",
      value: report ? completeTotal([report.recentTotals.likes, report.recentTotals.comments]) : null,
      note: report
        ? `${formatCount(report.recentTotals.likes)} beğeni · ${formatCount(report.recentTotals.comments)} yorum`
        : "Beğeni + yorum toplamı",
    },
  ];

  return (
    <div className="admin-metrics">
      {metrics.map((item, index) => (
        <div className={`admin-metric ${index === 0 ? "featured" : ""}`} key={item.label}>
          <div>
            <h2>{item.label}</h2>
          </div>
          <strong>{formatCount(item.value)}</strong>
          <p>{item.note}</p>
        </div>
      ))}
    </div>
  );
}

export function InstagramInsightCards({ report }: { report: InstagramReport }) {
  if (!report.insights.available) return null;

  const cards = [
    { label: "Profil ziyareti", value: report.insights.profileViews },
    { label: "Görüntülenme", value: report.insights.views },
    { label: "Etkileşen hesap", value: report.insights.accountsEngaged },
  ].filter(card => card.value !== null);

  if (!cards.length) return null;

  return (
    <section className="admin-card admin-instagram-insights">
      <div className="admin-card-heading">
        <h2>Hesap Insights</h2>
        <span>{new Date(report.insights.window.since * 1000).toLocaleDateString("tr-TR", { timeZone: "UTC" })} · Tam gün (UTC)</span>
      </div>
      <div className="admin-instagram-insight-grid">
        {cards.map(card => (
          <div key={card.label}>
            <p>{card.label}</p>
            <strong>{formatCount(card.value)}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InstagramMediaTable({ media, unavailable = false }: { media: InstagramMediaItem[]; unavailable?: boolean }) {
  if (!media.length) {
    return <p className="admin-empty">{unavailable ? "Gönderiler yüklenemedi." : "Henüz listelenecek gönderi yok."}</p>;
  }

  const hasInsights = media.some(item => item.insights);

  return (
    <div className="admin-table-scroll">
      <table>
        <thead>
          <tr>
            <th scope="col">Gönderi</th>
            <th scope="col">Tür</th>
            <th scope="col">Beğeni</th>
            <th scope="col">Yorum</th>
            {hasInsights ? (
              <>
                <th scope="col">Erişim</th>
                <th scope="col">Kayıt</th>
              </>
            ) : null}
            <th scope="col">Tarih</th>
            <th scope="col">
              <span className="sr-only">Bağlantı</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {media.map(item => (
            <tr key={item.id}>
              <th scope="row">
                <div className="admin-instagram-media-cell">
                  {item.thumbnailUrl ? (
                    // Instagram CDN hostnames vary; admin-only preview, no optimizer needed.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.thumbnailUrl} alt="" width={48} height={48} className="admin-instagram-thumb" />
                  ) : (
                    <span className="admin-instagram-thumb placeholder" aria-hidden="true" />
                  )}
                  <span>{captionPreview(item.caption)}</span>
                </div>
              </th>
              <td>{mediaLabel(item)}</td>
              <td>
                <span className="admin-instagram-stat">
                  <Heart size={13} aria-hidden="true" />
                  {formatCount(item.likeCount)}
                </span>
              </td>
              <td>
                <span className="admin-instagram-stat">
                  <MessageCircle size={13} aria-hidden="true" />
                  {formatCount(item.commentsCount)}
                </span>
              </td>
              {hasInsights ? (
                <>
                  <td>
                    <span className="admin-instagram-stat">
                      <Eye size={13} aria-hidden="true" />
                      {formatCount(item.insights?.reach)}
                    </span>
                  </td>
                  <td>
                    <span className="admin-instagram-stat">
                      <Bookmark size={13} aria-hidden="true" />
                      {formatCount(item.insights?.saved)}
                      {item.insights?.shares != null ? (
                        <>
                          {" "}
                          <Share2 size={13} aria-hidden="true" />
                          {formatCount(item.insights.shares)}
                        </>
                      ) : null}
                    </span>
                  </td>
                </>
              ) : null}
              <td>{item.timestamp ? formatDate(item.timestamp) : "—"}</td>
              <td>
                {item.permalink ? (
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Gönderiyi Instagram’da aç"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
