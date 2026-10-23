import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import {
  InstagramInsightCards,
  InstagramMediaTable,
  InstagramMetrics,
} from "@/components/admin/InstagramReport";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { formatDate } from "@/lib/format";
import { getInstagramConnection, getInstagramReport } from "@/lib/instagram/report";
import { formatCount } from "@/lib/instagram/metrics";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Instagram", robots: { index: false, follow: false } };

export default async function InstagramAdminPage() {
  const connection = getInstagramConnection();
  const result = await getInstagramReport(12);
  const profileUrl = result.data?.profile.username ? `https://www.instagram.com/${encodeURIComponent(result.data.profile.username)}/` : site.instagramUrl;
  const username = result.data?.profile.username
    ? `@${result.data.profile.username}`
    : "Bağlı Instagram";

  return (
    <section className="admin-analytics-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">SOSYAL MERKEZ</p>
          <h1>Instagram</h1>
          <p>
            {username} hesabının profil özeti ve son gönderi performansı. Token sunucuda kalır; tarayıcıya
            inmez.
          </p>
        </div>
        {profileUrl ? <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="admin-button">
          Profili aç <ArrowUpRight size={16} />
        </a> : null}
      </div>

      {result.error ? (
        <p role="alert" className="admin-error">
          {result.error} Veriler yüklenemediği için sayılar gösterilmiyor.
        </p>
      ) : null}

      {result.data?.warnings.map(warning => <p key={warning} role="status" className="admin-error">{warning}</p>)}
      <InstagramMetrics report={result.data} />

      {!connection.ready ? (
        <section className="admin-card admin-analytics-setup">
          <SocialIcon kind="instagram" size={28} />
          <div>
            <h2>Instagram token’ını sunucuya ekle.</h2>
            <p>
              Codex’teki <code>instagram-monitor</code> eklentisinde kullandığın access token yeterli.
              Aynı değeri yalnızca sunucu ortam değişkenine yapıştır; sohbete veya panele yazma.
            </p>
            <ol>
              <li>
                Yerel: <code>.env.local</code> içine <code>INSTAGRAM_ACCESS_TOKEN=...</code> satırını ekle.
              </li>
              <li>Vercel’de aynı değişkeni Production / Preview ortamına koy.</li>
              <li>İsteğe bağlı: <code>INSTAGRAM_API_BASE=https://graph.instagram.com</code></li>
              <li>
                Insights için Meta uygulamasındaki izinleri kontrol et. Yeni izinler verildiğinde hesabı yeniden yetkilendirmen ve token’ı yenilemen gerekebilir.
              </li>
            </ol>
            <p>
              Token’ı buraya yapıştırma. Kaynak dosya:{" "}
              <code>~/.config/instagram-monitor/.env</code>
            </p>
          </div>
        </section>
      ) : null}

      {result.data ? (
        <>
          <div className="admin-dashboard-grid admin-instagram-grid">
            <section className="admin-card">
              <div className="admin-card-heading">
                <h2>Hesap</h2>
                <span>{result.data.profile.accountType || "—"}</span>
              </div>
              <dl className="admin-instagram-profile">
                <div>
                  <dt>Kullanıcı adı</dt>
                  <dd>{username}</dd>
                </div>
                <div>
                  <dt>İsim</dt>
                  <dd>{result.data.profile.name || "—"}</dd>
                </div>
                <div>
                  <dt>Takip</dt>
                  <dd>
                    {formatCount(result.data.profile.followsCount)}
                  </dd>
                </div>
                <div>
                  <dt>Son çekim</dt>
                  <dd>{formatDate(result.data.fetchedAt)}</dd>
                </div>
              </dl>
            </section>
            <InstagramInsightCards report={result.data} />

          </div>

          <section className="admin-card admin-instagram-media" style={{ marginTop: 18 }}>
            <div className="admin-card-heading">
              <h2>Son gönderiler</h2>
              <span>
                {result.data.mediaAvailable ? result.data.media.length : "—"} medya ·{" "}
                {formatCount(result.data.recentTotals.likes)} beğeni ·{" "}
                {formatCount(result.data.recentTotals.comments)} yorum
              </span>
            </div>
            <InstagramMediaTable media={result.data.media} unavailable={!result.data.mediaAvailable} />
          </section>
        </>
      ) : null}

      <p className="admin-analytics-note">
        Beğeni ve yorum sayıları anlık API değeridir; erişim / gösterim Insights izni ister. Bu ekran
        yalnızca senin oturumun için çalışır ve her açılışta Meta’dan taze veri çeker. Token asla log’a
        veya istemciye yazılmaz.
      </p>
    </section>
  );
}
